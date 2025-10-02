import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, User, Clock, ArrowLeft, Tag, Share2, Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BlogPost = () => {
  useScrollReveal();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [blogPost, setBlogPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogPost(id);
    }
  }, [id]);

  const fetchBlogPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Error fetching blog post:', error);
        toast({
          title: "Error loading blog post",
          description: "Please try again later.",
          variant: "destructive"
        });
        return;
      }

      setBlogPost(data);
      console.log('Blog post data:', data);

      // Fetch comments
      const { data: commentsData } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      setComments(commentsData || []);

      // Fetch related posts
      const { data: related } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('category', data?.category)
        .neq('id', postId)
        .eq('published', true)
        .limit(2);

      setRelatedPosts(related || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading blog post...</p>
        </div>
      </Layout>
    );
  }

  if (!blogPost) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Link to="/blog">
            <Button className="btn-primary">
              <ArrowLeft className="mr-2" size={16} />
              Back to Blog
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const newLikeCount = (blogPost.likes_count || 0) + (isLiked ? -1 : 1);
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ likes_count: newLikeCount })
        .eq('id', id);

      if (error) {
        console.error('Error updating likes:', error);
        toast({
          title: "Error",
          description: "Failed to update like. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setIsLiked(!isLiked);
      setBlogPost({ ...blogPost, likes_count: newLikeCount });
      
      toast({
        title: isLiked ? "Removed from likes" : "Added to likes",
        description: isLiked ? "Post unliked successfully" : "Post liked successfully"
      });
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked ? "Post unbookmarked" : "Post bookmarked successfully"
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blogPost.title,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing or sharing failed
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this link with others."
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this link with others."
      });
    }
  };

  const handleCommentLike = async (commentId: string, currentLikes: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const newLikeCount = currentLikes + 1;
      
      const { error } = await supabase
        .from('blog_comments')
        .update({ likes_count: newLikeCount })
        .eq('id', commentId);

      if (error) {
        console.error('Error updating comment likes:', error);
        toast({
          title: "Error",
          description: "Failed to like comment. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Update the comments list
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes_count: newLikeCount }
          : comment
      ));
      
      toast({
        title: "Comment liked",
        description: "Thanks for your feedback!"
      });
    } catch (error) {
      console.error('Error handling comment like:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please write a comment before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('display_name')
        .eq('user_id', userData.user?.id)
        .single();

      const { error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: id,
          author_id: userData.user?.id,
          author_name: profileData?.display_name || userData.user?.email || 'Anonymous',
          content: newComment.trim(),
          approved: false // Comments need approval
        });

      if (error) {
        console.error('Error submitting comment:', error);
        toast({
          title: "Error",
          description: "Failed to submit comment. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setNewComment("");
      toast({
        title: "Comment submitted",
        description: "Your comment has been submitted for approval."
      });
      
      // Refresh comments
      if (id) {
        const { data: commentsData } = await supabase
          .from('blog_comments')
          .select('*')
          .eq('post_id', id)
          .eq('approved', true)
          .order('created_at', { ascending: false });
        setComments(commentsData || []);
      }
    } catch (error) {
      console.error('Error handling comment submission:', error);
    }
  };

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-6 py-20">
        {/* Back Navigation */}
        <div className="mb-8 animate-slide-in-up">
          <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-k2d">
            <ArrowLeft className="mr-2" size={18} />
            Back to Blog
          </Link>
        </div>

        {/* Hero Image */}
        <div className="w-full h-64 md:h-96 rounded-2xl mb-8 overflow-hidden animate-slide-in-up delay-200">
          <img 
            src={blogPost.image_urls?.[0] || blogPost.image_url || '/placeholder.svg'} 
            alt={blogPost.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Article Header */}
        <header className="mb-12 animate-slide-in-up delay-400">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-k2d">
              {blogPost.category}
            </Badge>
            {Array.isArray(blogPost.tags) && blogPost.tags?.map((tag: any, index: number) => (
              <Badge key={index} variant="secondary" className="font-k2d">
                <Tag size={12} className="mr-1" />
                {typeof tag === 'string' ? tag : tag?.name || 'Tag'}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight font-orbitron">
            {blogPost.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center space-x-2">
              <User size={18} />
              <span className="font-k2d">{blogPost.author_name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span className="font-k2d">{new Date(blogPost.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={18} />
              <span className="font-k2d">{blogPost.read_time || '5 min read'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={`${isLiked ? 'text-red-500 border-red-500' : 'text-muted-foreground'} hover:text-red-500 hover:border-red-500 transition-colors font-k2d`}
            >
              <Heart size={16} className={`mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {(blogPost.likes_count || 0) + (isLiked ? 1 : 0)}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className={`${isBookmarked ? 'text-primary border-primary' : 'text-muted-foreground'} hover:text-primary hover:border-primary transition-colors font-k2d`}
            >
              <Bookmark size={16} className={`mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
              Save
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-muted-foreground hover:text-primary hover:border-primary transition-colors font-k2d"
            >
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </header>

        {/* Content with Images */}
        <div className="prose prose-lg max-w-none mb-12 animate-slide-in-up delay-600">
          <div className="text-muted-foreground leading-relaxed font-k2d space-y-8">
            {(() => {
              console.log('blogPost.content_blocks:', blogPost.content_blocks);
              console.log('blogPost.content:', blogPost.content);
              
              // Handle content_blocks (JSONB array)
              if (Array.isArray(blogPost.content_blocks) && blogPost.content_blocks.length > 0) {
                return blogPost.content_blocks.map((block: any, index: number) => {
                  console.log('Rendering content_blocks item:', block, 'Type:', typeof block);
                  
                  if (typeof block === 'string') {
                    return (
                      <div key={index}>
                        <p className="mb-6">{block}</p>
                        {blogPost.image_urls?.[index + 1] && (
                          <div className="w-full h-64 rounded-xl overflow-hidden my-8 hover-lift">
                            <img 
                              src={blogPost.image_urls[index + 1]} 
                              alt="Article illustration"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  if (block && typeof block === 'object' && block.content) {
                    return (
                      <div key={index}>
                        {block.type === 'paragraph' && (
                          <p className="mb-6">{String(block.content)}</p>
                        )}
                        {block.type === 'heading' && (
                          <h3 className="text-xl font-semibold mb-4 font-orbitron">{String(block.content)}</h3>
                        )}
                        {block.type === 'list' && (
                          <ul className="list-disc list-inside mb-4">
                            {Array.isArray(block.content) ? block.content.map((item: any, i: number) => (
                              <li key={i}>{String(item)}</li>
                            )) : <li>{String(block.content)}</li>}
                          </ul>
                        )}
                        {!['paragraph', 'heading', 'list'].includes(block.type) && (
                          <p className="mb-6">{String(block.content)}</p>
                        )}
                        {blogPost.image_urls?.[index + 1] && (
                          <div className="w-full h-64 rounded-xl overflow-hidden my-8 hover-lift">
                            <img 
                              src={blogPost.image_urls[index + 1]} 
                              alt="Article illustration"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return <p key={index} className="mb-6">{String(block)}</p>;
                });
              }
              
              // Handle legacy content field as string
              if (typeof blogPost.content === 'string' && blogPost.content.trim()) {
                const paragraphs = blogPost.content.split('\n').filter(p => p.trim());
                return paragraphs.map((paragraph: string, index: number) => (
                  <div key={index}>
                    <p className="mb-6">{paragraph}</p>
                    {blogPost.image_urls?.[index + 1] && (
                      <div className="w-full h-64 rounded-xl overflow-hidden my-8 hover-lift">
                        <img 
                          src={blogPost.image_urls[index + 1]} 
                          alt="Article illustration"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
                ));
              }
              
              // Final fallback
              return <p className="mb-6">{blogPost.excerpt || "Content not available"}</p>;
            })()}
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-12 animate-slide-in-up delay-800">
          <span className="text-muted-foreground font-k2d mr-4">Tags:</span>
          {Array.isArray(blogPost.tags) && blogPost.tags?.map((tag: any, index: number) => (
            <Badge key={index} variant="outline" className="hover:bg-primary/10 transition-colors font-k2d">
              #{typeof tag === 'string' ? tag : tag?.name || 'tag'}
            </Badge>
          ))}
        </div>

        {/* Comments Section */}
        <Card className="card-glass animate-slide-in-up delay-1000">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-6 font-orbitron">
              Comments ({comments.length})
            </h3>
            
            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="space-y-4">
                <Textarea
                  placeholder={isAuthenticated ? "Share your thoughts..." : "Please login to comment"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-card/50 border-primary/20 focus:border-primary font-k2d"
                  disabled={!isAuthenticated}
                />
                <div className="flex justify-end">
                  <Button type="submit" className="btn-primary" disabled={!isAuthenticated}>
                    <Send size={16} className="mr-2" />
                    <span className="font-k2d">Post Comment</span>
                  </Button>
                </div>
              </div>
            </form>
            
            {/* Comments List */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment: any) => (
                  <div key={comment.id} className="border-l-2 border-primary/20 pl-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-sm font-semibold">
                            {(comment.author_name || 'A').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium font-k2d">{comment.author_name || 'Anonymous'}</span>
                        <span className="text-sm text-muted-foreground font-k2d">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => handleCommentLike(comment.id, comment.likes_count || 0)}
                      >
                        <Heart size={16} className="mr-1" />
                        {comment.likes_count || 0}
                      </Button>
                    </div>
                    <p className="text-muted-foreground font-k2d">
                      {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
              )}
            </div>
            
            {/* Login prompt for non-authenticated users */}
            {!isAuthenticated && (
              <div className="text-center mt-8 p-6 bg-primary/10 rounded-lg">
                <p className="text-muted-foreground mb-4 font-k2d">
                  Want to join the conversation?
                </p>
                <div className="space-x-4">
                  <Link to="/login">
                    <Button className="btn-primary">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" className="btn-secondary">Sign Up</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Posts */}
        <section className="mt-16 animate-slide-in-up delay-1200">
          <h3 className="text-2xl font-semibold mb-8 font-orbitron">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="card-service hover-lift">
                <CardContent className="p-0">
                  <div className="h-48 overflow-hidden rounded-t-2xl">
                    <img 
                      src={relatedPost.image_urls?.[0] || relatedPost.image_url || '/placeholder.svg'} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 mb-3 font-k2d">
                      {relatedPost.category}
                    </Badge>
                    <h4 className="text-lg font-semibold mb-3 line-clamp-2 font-orbitron">
                      {relatedPost.title}
                    </h4>
                    <p className="text-muted-foreground mb-4 line-clamp-2 font-k2d">
                      {relatedPost.excerpt}
                    </p>
                    <Link to={`/blog/${relatedPost.id}`}>
                      <Button className="btn-secondary">
                        <span className="font-k2d">Read More</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </article>
    </Layout>
  );
};

export default BlogPost;