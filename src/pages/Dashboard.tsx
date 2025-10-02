import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  Eye,
  EyeOff,
  Heart,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  Activity,
  Clock,
  Star
} from 'lucide-react';
import Layout from '@/components/Layout';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  content_blocks?: any; // JSON field from Supabase
  image_urls?: string[];
  author_id: string;
  author_name: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  image_url?: string;
  read_time?: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  likes_count: number;
  approved: boolean;
  created_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  created_at: string;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content_blocks: [{type: 'paragraph', content: ''}] as Array<{type: string; content: string}>,
    image_urls: [''] as string[],
    category: '',
    tags: '',
    featured: false,
    published: false,
    read_time: ''
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the dashboard.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    setCurrentUser({ ...session.user, profile });
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [postsRes, commentsRes, usersRes] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_comments').select('*').order('created_at', { ascending: false }),
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false })
      ]);

      if (postsRes.data) setPosts(postsRes.data);
      if (commentsRes.data) setComments(commentsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreatePost = async () => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: newPost.title,
          excerpt: newPost.excerpt,
          content: newPost.content_blocks.map(block => block.content).join('\n\n'), // Legacy support
          content_blocks: newPost.content_blocks,
          image_urls: newPost.image_urls.filter(url => url.trim() !== ''),
          author_id: currentUser.id,
          author_name: currentUser.profile.display_name || currentUser.email,
          category: newPost.category,
          tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          featured: newPost.featured,
          published: newPost.published,
          read_time: newPost.read_time,
          image_url: newPost.image_urls[0] || null // First image as legacy support
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully",
      });
      setIsCreatePostOpen(false);
      setNewPost({
        title: '',
        excerpt: '',
        content_blocks: [{type: 'paragraph', content: ''}],
        image_urls: [''],
        category: '',
        tags: '',
        featured: false,
        published: false,
        read_time: ''
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: editingPost.title,
          excerpt: editingPost.excerpt,
          content: editingPost.content,
          category: editingPost.category,
          tags: editingPost.tags,
          featured: editingPost.featured,
          published: editingPost.published,
          image_url: editingPost.image_url,
          read_time: editingPost.read_time
        })
        .eq('id', editingPost.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      setEditingPost(null);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleApproveComment = async (commentId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved })
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Comment ${approved ? 'approved' : 'rejected'} successfully`,
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(posts.map(post => post.category))];

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.published).length,
    draftPosts: posts.filter(p => !p.published).length,
    totalComments: comments.length,
    pendingComments: comments.filter(c => !c.approved).length,
    approvedComments: comments.filter(c => c.approved).length,
    totalUsers: users.length,
    totalViews: posts.reduce((sum, post) => sum + post.views_count, 0),
    totalLikes: posts.reduce((sum, post) => sum + post.likes_count, 0),
    featuredPosts: posts.filter(p => p.featured).length
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient mb-2 font-orbitron">
                  Blog Dashboard
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground font-k2d">
                  Welcome back, {currentUser?.profile?.display_name || currentUser?.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  disabled={refreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <Card className="card-glass hover:scale-105 transition-transform duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.publishedPosts} published
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass hover:scale-105 transition-transform duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Comments</CardTitle>
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{stats.totalComments}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingComments} pending
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass hover:scale-105 transition-transform duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Users</CardTitle>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  registered users
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass hover:scale-105 transition-transform duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Views</CardTitle>
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{stats.totalViews}</div>
                <p className="text-xs text-muted-foreground">
                  total views
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass hover:scale-105 transition-transform duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Likes</CardTitle>
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{stats.totalLikes}</div>
                <p className="text-xs text-muted-foreground">
                  total likes
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass hover:scale-105 transition-transform duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Featured</CardTitle>
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{stats.featuredPosts}</div>
                <p className="text-xs text-muted-foreground">
                  featured posts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="posts" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4 h-auto">
                <TabsTrigger value="posts" className="text-xs sm:text-sm">Posts</TabsTrigger>
                <TabsTrigger value="comments" className="text-xs sm:text-sm">Comments</TabsTrigger>
                <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
              </TabsList>
            </div>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row flex-1 gap-4 w-full lg:w-auto">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    {viewMode === 'grid' ? 'List' : 'Grid'}
                  </Button>
                  
                  <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                    <DialogTrigger asChild>
                      <Button className="btn-primary flex-1 lg:flex-none">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                        <DialogDescription>
                          Fill in the details to create a new blog post with multiple content blocks and images.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            placeholder="Enter post title"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="excerpt">Excerpt</Label>
                          <Textarea
                            id="excerpt"
                            value={newPost.excerpt}
                            onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                            placeholder="Brief description of the post"
                            className="min-h-[80px]"
                          />
                        </div>
                        
                        {/* Dynamic Content Blocks */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <Label>Content Paragraphs</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setNewPost({
                                ...newPost,
                                content_blocks: [...newPost.content_blocks, {type: 'paragraph', content: ''}]
                              })}
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add Paragraph
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {newPost.content_blocks.map((block, index) => (
                              <div key={index} className="relative border rounded-lg p-4 bg-muted/20">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-sm font-medium">Paragraph {index + 1}</Label>
                                  {newPost.content_blocks.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedBlocks = newPost.content_blocks.filter((_, i) => i !== index);
                                        setNewPost({ ...newPost, content_blocks: updatedBlocks });
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <Textarea
                                  value={block.content}
                                  onChange={(e) => {
                                    const updatedBlocks = [...newPost.content_blocks];
                                    updatedBlocks[index] = {type: 'paragraph', content: e.target.value};
                                    setNewPost({ ...newPost, content_blocks: updatedBlocks });
                                  }}
                                  placeholder={`Enter content for paragraph ${index + 1}...`}
                                  className="min-h-[120px]"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Dynamic Image URLs */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <Label>Image URLs</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setNewPost({
                                ...newPost,
                                image_urls: [...newPost.image_urls, '']
                              })}
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add Image URL
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {newPost.image_urls.map((url, index) => (
                              <div key={index} className="relative border rounded-lg p-3 bg-muted/20">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-sm font-medium">Image {index + 1}</Label>
                                  {newPost.image_urls.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedUrls = newPost.image_urls.filter((_, i) => i !== index);
                                        setNewPost({ ...newPost, image_urls: updatedUrls });
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <Input
                                  value={url}
                                  onChange={(e) => {
                                    const updatedUrls = [...newPost.image_urls];
                                    updatedUrls[index] = e.target.value;
                                    setNewPost({ ...newPost, image_urls: updatedUrls });
                                  }}
                                  placeholder={`Image URL ${index + 1}: https://example.com/image.jpg`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Design">Design</SelectItem>
                                <SelectItem value="Business">Business</SelectItem>
                                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                                <SelectItem value="Web Development">Web Development</SelectItem>
                                <SelectItem value="UI/UX">UI/UX</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="read_time">Read Time</Label>
                            <Input
                              id="read_time"
                              value={newPost.read_time}
                              onChange={(e) => setNewPost({ ...newPost, read_time: e.target.value })}
                              placeholder="5 min read"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="tags">Tags (comma separated)</Label>
                          <Input
                            id="tags"
                            value={newPost.tags}
                            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                            placeholder="React, JavaScript, Tutorial"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="featured"
                              checked={newPost.featured}
                              onCheckedChange={(checked) => setNewPost({ ...newPost, featured: checked })}
                            />
                            <Label htmlFor="featured">Featured</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="published"
                              checked={newPost.published}
                              onCheckedChange={(checked) => setNewPost({ ...newPost, published: checked })}
                            />
                            <Label htmlFor="published">Published</Label>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreatePost} className="btn-primary">
                            Create Post
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Posts Grid/List */}
              <div className={viewMode === 'grid' ? 'grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2' : 'space-y-4'}>
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="card-glass hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-lg sm:text-xl font-orbitron line-clamp-2">{post.title}</CardTitle>
                            {post.featured && <Badge variant="secondary"><Star className="h-3 w-3 mr-1" />Featured</Badge>}
                            <Badge variant={post.published ? "default" : "outline"}>
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <CardDescription className="font-k2d line-clamp-3">{post.excerpt}</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingPost(post)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        <span>{post.author_name}</span>
                        <span>{post.category}</span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views_count}
                        </span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No posts found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-6">
              <Card className="card-glass">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="font-orbitron">Comments Management</CardTitle>
                      <CardDescription className="font-k2d">Moderate and manage user comments</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{stats.pendingComments} pending</Badge>
                      <Badge variant="default">{stats.approvedComments} approved</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px]">Author</TableHead>
                          <TableHead className="min-w-[200px]">Content</TableHead>
                          <TableHead className="hidden sm:table-cell min-w-[150px]">Post</TableHead>
                          <TableHead className="hidden md:table-cell">Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {comments.map((comment) => {
                          const post = posts.find(p => p.id === comment.post_id);
                          return (
                            <TableRow key={comment.id}>
                              <TableCell className="font-medium">{comment.author_name}</TableCell>
                              <TableCell>
                                <div className="max-w-xs truncate" title={comment.content}>
                                  {comment.content}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="max-w-xs truncate" title={post?.title}>
                                  {post?.title || 'Unknown Post'}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant={comment.approved ? "default" : "secondary"}>
                                  {comment.approved ? 'Approved' : 'Pending'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {!comment.approved && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleApproveComment(comment.id, true)}
                                      title="Approve"
                                    >
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    </Button>
                                  )}
                                  {comment.approved && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleApproveComment(comment.id, false)}
                                      title="Reject"
                                    >
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteComment(comment.id)}
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {comments.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No comments yet</h3>
                      <p className="text-muted-foreground">Comments will appear here once users start commenting</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle className="font-orbitron">User Management</CardTitle>
                  <CardDescription className="font-k2d">Manage user roles and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden sm:table-cell">Bio</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="hidden md:table-cell">Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.display_name || 'No name'}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="max-w-xs truncate">
                                {user.bio || 'No bio'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  user.role === 'admin' ? 'destructive' :
                                  user.role === 'editor' ? 'default' : 'secondary'
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {currentUser?.profile?.role === 'admin' && (
                                <Select
                                  value={user.role}
                                  onValueChange={(role) => handleUpdateUserRole(user.user_id, role)}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="font-orbitron flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Content Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Views per Post</span>
                        <span className="font-bold">
                          {posts.length > 0 ? Math.round(stats.totalViews / posts.length) : 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Likes per Post</span>
                        <span className="font-bold">
                          {posts.length > 0 ? Math.round(stats.totalLikes / posts.length) : 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Engagement Rate</span>
                        <span className="font-bold">
                          {stats.totalViews > 0 ? ((stats.totalLikes / stats.totalViews) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-glass">
                  <CardHeader>
                    <CardTitle className="font-orbitron flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Publishing Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Published Posts</span>
                        <span className="font-bold text-green-600">{stats.publishedPosts}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Draft Posts</span>
                        <span className="font-bold text-yellow-600">{stats.draftPosts}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Publication Rate</span>
                        <span className="font-bold">
                          {posts.length > 0 ? ((stats.publishedPosts / posts.length) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Edit Post Dialog */}
          <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Post</DialogTitle>
                <DialogDescription>
                  Make changes to your blog post.
                </DialogDescription>
              </DialogHeader>
              {editingPost && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-excerpt">Excerpt</Label>
                    <Textarea
                      id="edit-excerpt"
                      value={editingPost.excerpt}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-content">Content</Label>
                    <Textarea
                      id="edit-content"
                      value={editingPost.content}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      rows={8}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-category">Category</Label>
                      <Input
                        id="edit-category"
                        value={editingPost.category}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-read-time">Read Time</Label>
                      <Input
                        id="edit-read-time"
                        value={editingPost.read_time || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, read_time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                    <Input
                      id="edit-tags"
                      value={editingPost.tags.join(', ')}
                      onChange={(e) => setEditingPost({ 
                        ...editingPost, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-image-url">Image URL</Label>
                    <Input
                      id="edit-image-url"
                      value={editingPost.image_url || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, image_url: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-featured"
                        checked={editingPost.featured}
                        onCheckedChange={(checked) => setEditingPost({ ...editingPost, featured: checked })}
                      />
                      <Label htmlFor="edit-featured">Featured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-published"
                        checked={editingPost.published}
                        onCheckedChange={(checked) => setEditingPost({ ...editingPost, published: checked })}
                      />
                      <Label htmlFor="edit-published">Published</Label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingPost(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdatePost}>Update Post</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;