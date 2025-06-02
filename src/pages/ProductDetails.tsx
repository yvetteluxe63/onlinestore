
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Star, ArrowLeft, Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAdmin } from '@/context/AdminContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: adminState } = useAdmin();
  const { dispatch } = useCart();
  const { dispatch: wishlistDispatch, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const product = adminState.products.find(p => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center animate-fade-in">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    // Check if size and color are required and selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: selectedSize,
          color: selectedColor
        }
      });
    }
    toast.success(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.id });
      toast.success(`Removed ${product.name} from wishlist`);
    } else {
      wishlistDispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        }
      });
      toast.success(`Added ${product.name} to wishlist!`);
    }
  };

  const relatedProducts = adminState.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-orange-500 hover:text-orange-600 animate-slide-in-left"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative animate-fade-in">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-96 md:h-[500px] object-cover rounded-lg shadow-lg hover-scale"
            />
            {product.featured && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                Featured
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-slide-in-right">
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-600 ml-2">(4.8) • 127 reviews</span>
              </div>

              <p className="text-4xl font-bold text-orange-500 mb-6">
                {adminState.currency} {product.price}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <Label htmlFor="size" className="text-lg font-semibold mb-3 block">Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <Label htmlFor="color" className="text-lg font-semibold mb-3 block">Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="hover-scale"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="hover-scale"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <span className="text-gray-600">
                  Total: {adminState.currency} {(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full bg-orange-500 hover:bg-orange-600 hover-scale"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2" size={20} />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full hover-scale"
                onClick={handleWishlistToggle}
              >
                <Heart 
                  className={`mr-2 ${
                    isInWishlist(product.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-500'
                  }`} 
                  size={20} 
                />
                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <Card 
                  key={relatedProduct.id} 
                  className="group hover:shadow-lg transition-all duration-300 hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-orange-500 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-500">
                          {adminState.currency} {relatedProduct.price}
                        </span>
                        <Button 
                          size="sm" 
                          className="bg-orange-500 hover:bg-orange-600 hover-scale"
                          onClick={() => navigate(`/product/${relatedProduct.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
