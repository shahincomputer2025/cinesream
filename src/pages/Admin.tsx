import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Upload, Link as LinkIcon, Search, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import { iaVideos, IASearchResult } from '@/lib/iaVideos';
import { tmdb, Movie } from '@/lib/tmdb';
import { toast } from 'sonner';

const Admin = () => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadMovieId, setUploadMovieId] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [linkMovieId, setLinkMovieId] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<IASearchResult[]>([]);
  const [linking, setLinking] = useState(false);

  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  
  const { data: movies } = useQuery<Movie[]>({
    queryKey: ['movies', movieSearchQuery],
    queryFn: () => tmdb.searchMovies(movieSearchQuery),
    enabled: movieSearchQuery.length > 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleUpload = async () => {
    if (!uploadFile || !uploadMovieId || !uploadTitle) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      const result = await iaVideos.uploadVideo({
        movieId: parseInt(uploadMovieId),
        title: uploadTitle,
        description: uploadDescription,
        file: uploadFile,
      });

      toast.success('Video uploaded successfully!');
      setUploadFile(null);
      setUploadMovieId('');
      setUploadTitle('');
      setUploadDescription('');
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      toast.error('Please enter a search query');
      return;
    }

    setSearching(true);
    try {
      const results = await iaVideos.searchMovies(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        toast.info('No videos found');
      }
    } catch (error: any) {
      toast.error(`Search failed: ${error.message}`);
    } finally {
      setSearching(false);
    }
  };

  const handleLink = async (result: IASearchResult) => {
    if (!linkMovieId) {
      toast.error('Please enter a movie ID');
      return;
    }

    setLinking(true);
    try {
      await iaVideos.linkVideo({
        movieId: parseInt(linkMovieId),
        iaIdentifier: result.identifier,
        title: result.title,
        description: result.description,
      });

      toast.success('Video linked successfully!');
    } catch (error: any) {
      toast.error(`Link failed: ${error.message}`);
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground mb-8">
            Manage Internet Archive videos for movies
          </p>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="link">
                <LinkIcon className="w-4 h-4 mr-2" />
                Link Existing
              </TabsTrigger>
              <TabsTrigger value="search">
                <Search className="w-4 h-4 mr-2" />
                Search Movies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Video to Internet Archive</CardTitle>
                  <CardDescription>
                    Upload a new video file to Internet Archive and link it to a movie
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="upload-movie-id">Movie ID *</Label>
                    <Input
                      id="upload-movie-id"
                      type="number"
                      value={uploadMovieId}
                      onChange={(e) => setUploadMovieId(e.target.value)}
                      placeholder="Enter TMDB movie ID"
                    />
                  </div>

                  <div>
                    <Label htmlFor="upload-title">Video Title *</Label>
                    <Input
                      id="upload-title"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="Enter video title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="upload-description">Description</Label>
                    <Textarea
                      id="upload-description"
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="Enter video description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="upload-file">Video File *</Label>
                    <Input
                      id="upload-file"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                    {uploadFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !uploadFile || !uploadMovieId || !uploadTitle}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Video'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="link">
              <Card>
                <CardHeader>
                  <CardTitle>Search & Link Internet Archive Videos</CardTitle>
                  <CardDescription>
                    Search for existing videos on Internet Archive and link them to movies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for movies on Internet Archive..."
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={searching}>
                      <Search className="w-4 h-4 mr-2" />
                      {searching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="link-movie-id">Link to Movie ID</Label>
                    <Input
                      id="link-movie-id"
                      type="number"
                      value={linkMovieId}
                      onChange={(e) => setLinkMovieId(e.target.value)}
                      placeholder="Enter TMDB movie ID to link videos to"
                    />
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {searchResults.map((result) => (
                        <Card key={result.identifier}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{result.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {result.description}
                                </p>
                                <div className="flex gap-4 text-xs text-muted-foreground">
                                  {result.uploadDate && <span>Uploaded: {new Date(result.uploadDate).toLocaleDateString()}</span>}
                                  {result.duration && <span>Duration: {result.duration}</span>}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleLink(result)}
                                disabled={!linkMovieId || linking}
                              >
                                <LinkIcon className="w-4 h-4 mr-1" />
                                Link
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="search">
              <Card>
                <CardHeader>
                  <CardTitle>Search TMDB Movies</CardTitle>
                  <CardDescription>
                    Find movie IDs from The Movie Database
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="movie-search">Search Movies</Label>
                    <Input
                      id="movie-search"
                      value={movieSearchQuery}
                      onChange={(e) => setMovieSearchQuery(e.target.value)}
                      placeholder="Search for a movie..."
                    />
                  </div>

                  {movies && movies.length > 0 && (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {movies.map((movie) => (
                        <Card key={movie.id}>
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              {movie.poster_path && (
                                <img
                                  src={tmdb.getImageUrl(movie.poster_path, 'w200')}
                                  alt={movie.title}
                                  className="w-12 h-18 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold">{movie.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(movie.release_date).getFullYear()} • ID: {movie.id}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(movie.id.toString());
                                  toast.success('Movie ID copied!');
                                }}
                              >
                                Copy ID
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default Admin;