
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { Artwork } from '@/types/artwork';

interface GalleryViewProps {
  artworks: Artwork[];
  onUpdateArtwork: (artworkId: string, updates: Partial<Artwork>) => void;
  onDeleteArtwork: (artworkId: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  artworks,
  onUpdateArtwork,
  onDeleteArtwork
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const startEditing = (artwork: Artwork) => {
    setEditingId(artwork.id);
    setEditForm({ title: artwork.title, description: artwork.description });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '' });
  };

  const saveEditing = () => {
    if (editingId) {
      onUpdateArtwork(editingId, editForm);
      setEditingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Obras</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <Card key={artwork.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200">
            <div className="aspect-[4/5] relative overflow-hidden">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => startEditing(artwork)}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteArtwork(artwork.id)}
                    className="bg-red-500/90 hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              {editingId === artwork.id ? (
                <div className="space-y-3">
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Título de la obra"
                  />
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Descripción"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={saveEditing} className="flex-1">
                      <Save size={14} className="mr-1" />
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{artwork.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{artwork.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
