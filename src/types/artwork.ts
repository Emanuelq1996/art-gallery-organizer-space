
export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  folderPath: string[];
}

export interface Folder {
  id: string;
  name: string;
  path: string[];
  artworks: Artwork[];
}
