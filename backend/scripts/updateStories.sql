UPDATE stories
SET 
  created_at = NOW(),
  expires_at = DATE_ADD(NOW(), INTERVAL 1 DAY)
WHERE id BETWEEN 1 AND 20;
UPDATE woo_gallery
SET 
  created_at = NOW(),
  expires_at = DATE_ADD(NOW(), INTERVAL 1 DAY)
WHERE id BETWEEN 1 AND 17;