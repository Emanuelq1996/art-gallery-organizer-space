
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Palette } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, useMock = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password, useMock);
      toast({
        title: "Éxito",
        description: useMock ? "Sesión iniciada con usuario mock" : "Sesión iniciada correctamente"
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fillMockCredentials = () => {
    setEmail('artist@mock.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Palette className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Galería de Arte
          </CardTitle>
          <p className="text-gray-600">Accede a tu galería personal</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Para pruebas
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={fillMockCredentials}
            >
              Llenar credenciales de prueba
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
            >
              Acceder con usuario mock
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Usuario de prueba:</p>
            <p className="font-mono text-xs">
              artist@mock.com / password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
