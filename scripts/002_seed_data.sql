-- Seed data for AlumniConnect AI
-- Sample mentors and jobs for demonstration

-- Insert sample mentors (these will be visible to all users)
insert into public.mentors (name, initials, title, company, match_score, bio) values
  ('Rajesh Joshi', 'RJ', 'Senior Product Manager', 'Google', 96, 'Ex-Microsoft, 10+ years in product management. Passionate about helping students break into product careers.'),
  ('Anjali Nair', 'AN', 'Data Science Lead', 'Amazon', 91, 'AI/ML specialist with expertise in recommendation systems. Love mentoring aspiring data scientists.'),
  ('Vikram Mehta', 'VM', 'Engineering Director', 'Meta', 88, 'Leading teams of 50+ engineers. Started as an intern, happy to share my journey.'),
  ('Priya Sharma', 'PS', 'UX Design Lead', 'Apple', 85, 'Design thinking expert. Helping students build amazing portfolios.'),
  ('Arjun Reddy', 'AR', 'VP of Engineering', 'Microsoft', 82, 'Cloud architecture specialist. Open to coffee chats and career guidance.')
on conflict do nothing;

-- Insert sample jobs
insert into public.jobs (title, company, location, description, is_active) values
  ('Software Engineer Intern', 'Microsoft', 'Remote / Hyderabad', 'Join our Azure team for a 3-month internship. Great learning opportunity for students.', true),
  ('Product Marketing Associate', 'Adobe', 'San Jose, CA', 'Help launch creative products to millions of users worldwide.', true),
  ('Data Analyst - Entry Level', 'Google', 'Bangalore, India', 'Work with big data and help drive business decisions.', true),
  ('Frontend Developer', 'Flipkart', 'Bangalore, India', 'Build beautiful e-commerce experiences for millions of users.', true),
  ('Machine Learning Engineer', 'Amazon', 'Seattle, WA', 'Work on cutting-edge ML models for recommendation systems.', true)
on conflict do nothing;
