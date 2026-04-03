
-- SUPABASE SETUP SQL FOR BARAA PORTFOLIO
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO INITIALIZE TABLES

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    category TEXT,
    role TEXT,
    image TEXT,
    video TEXT,
    description TEXT,
    gear TEXT[],
    aspect_ratio TEXT DEFAULT '16/9',
    font TEXT DEFAULT 'IBM Plex Sans Arabic',
    release_date DATE,
    sort_order INTEGER DEFAULT 0
);

-- 2. EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    role TEXT NOT NULL,
    company TEXT,
    period TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

-- 3. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category TEXT NOT NULL,
    items TEXT[],
    sort_order INTEGER DEFAULT 0
);

-- 4. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    professional_title TEXT,
    hero_bio TEXT,
    bio_detailed TEXT,
    hero_image TEXT,
    hero_video TEXT,
    CONSTRAINT single_row CHECK (id = 1)
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES (Allow everyone to read)
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Allow public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read site_settings" ON site_settings FOR SELECT USING (true);

-- CREATE POLICIES (Allow only YOU to write)
-- Note: Replace 'YOUR-UUID-HERE' with your actual User ID from the Supabase Authentication dashboard
CREATE POLICY "Allow admin write projects" ON projects FOR ALL TO authenticated USING (auth.uid() = 'YOUR-UUID-HERE');
CREATE POLICY "Allow admin write experience" ON experience FOR ALL TO authenticated USING (auth.uid() = 'YOUR-UUID-HERE');
CREATE POLICY "Allow admin write skills" ON skills FOR ALL TO authenticated USING (auth.uid() = 'YOUR-UUID-HERE');
CREATE POLICY "Allow admin write site_settings" ON site_settings FOR ALL TO authenticated USING (auth.uid() = 'YOUR-UUID-HERE');
