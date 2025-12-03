import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cartService } from '../lib/database';

// Hoist mocks to be accessible inside vi.mock
const mocks = vi.hoisted(() => {
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockEq = vi.fn();
  const mockSingle = vi.fn();

  // Create a recursive builder that is also thenable
  const builder: any = {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    single: mockSingle,
    then: (resolve: any) => resolve({ data: null, error: null }) // Default resolution
  };

  // Wire up the mocks to return the builder
  mockFrom.mockReturnValue(builder);
  mockSelect.mockReturnValue(builder);
  mockInsert.mockReturnValue(builder);
  mockUpdate.mockReturnValue(builder);
  mockDelete.mockReturnValue(builder);
  mockEq.mockReturnValue(builder);
  
  // single() usually returns a Promise, not a builder (in this usage pattern it's awaited directly)
  // But in database.ts: .single() is awaited. So it should return a Promise (or be thenable).
  // We can make mockSingle return a Promise.
  mockSingle.mockResolvedValue({ data: null, error: null });

  return {
    mockFrom,
    mockSelect,
    mockInsert,
    mockUpdate,
    mockDelete,
    mockEq,
    mockSingle,
    builder // Export builder to modify 'then' behavior if needed
  };
});

// Mock the module
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: mocks.mockFrom,
  },
}));

describe('cartService', () => {
  const userId = 'user-123';
  const productId = 101;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset default return values if needed, but for now they are static
  });

  it('should add a new item to cart if it does not exist', async () => {
    // Setup: Item does not exist
    mocks.mockSingle.mockResolvedValue({ data: null, error: null });
    // Insert success (insert returns builder, which resolves to default { data: null, error: null })
    // We can override the builder's then for this specific test if needed, but default is fine for void return
    
    await cartService.addToCart(userId, productId, 1);

    expect(mocks.mockFrom).toHaveBeenCalledWith('cart_items');
    expect(mocks.mockSelect).toHaveBeenCalled(); // Checks existence
    expect(mocks.mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      user_id: userId,
      product_id: productId,
      quantity: 1
    }));
  });

  it('should update quantity if item already exists (Merge Logic)', async () => {
    // Setup: Item exists with quantity 1
    mocks.mockSingle.mockResolvedValue({ 
      data: { id: 'cart-item-1', quantity: 1, user_id: userId, product_id: productId }, 
      error: null 
    });
    
    // Update chain: update({...}).eq(...) -> resolves to { error: null }
    // The default builder.then resolves to { data: null, error: null }, which works for update check
    
    await cartService.addToCart(userId, productId, 1);

    expect(mocks.mockFrom).toHaveBeenCalledWith('cart_items');
    expect(mocks.mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
      quantity: 2 // 1 + 1
    }));
  });
});
