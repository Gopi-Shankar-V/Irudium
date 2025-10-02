-- Update blog_posts table to support multiple paragraphs and images
ALTER TABLE blog_posts 
ADD COLUMN content_blocks JSONB DEFAULT '[]'::jsonb,
ADD COLUMN image_urls TEXT[] DEFAULT '{}';

-- Add index for better performance on content_blocks queries
CREATE INDEX idx_blog_posts_content_blocks ON blog_posts USING GIN(content_blocks);

-- Update existing posts to migrate content to new structure
UPDATE blog_posts 
SET content_blocks = CASE 
  WHEN content IS NOT NULL AND content != '' THEN 
    jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', content))
  ELSE '[]'::jsonb
END
WHERE content_blocks = '[]'::jsonb;