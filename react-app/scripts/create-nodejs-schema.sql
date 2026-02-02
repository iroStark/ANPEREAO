-- Schema SQL para Node.js/Drizzle
-- Cria as tabelas compatíveis com o schema Drizzle
-- IDs são UUIDs (VARCHAR 36) em vez de BIGINT auto-increment

SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if exist
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS orgaos_sociais;
DROP TABLE IF EXISTS activity_plan_items;
DROP TABLE IF EXISTS activity_plan;
DROP TABLE IF EXISTS slideshow;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS gallery;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS publications;
DROP TABLE IF EXISTS legislation;
DROP TABLE IF EXISTS timeline_events;
DROP TABLE IF EXISTS about_content;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'viewer',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About Content table
CREATE TABLE about_content (
  id VARCHAR(36) PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_section (section)
);

-- Timeline Events table
CREATE TABLE timeline_events (
  id VARCHAR(36) PRIMARY KEY,
  year VARCHAR(10) NOT NULL,
  event TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  image_url TEXT,
  `order` INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_year (year),
  INDEX idx_order (order),
  INDEX idx_active (is_active)
);

-- Legislation table
CREATE TABLE legislation (
  id VARCHAR(36) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  year VARCHAR(4) NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'BookOpen',
  content TEXT,
  file_url TEXT,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_year (year)
);

-- Publications table
CREATE TABLE publications (
  id VARCHAR(36) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  date VARCHAR(50) NOT NULL,
  file_url TEXT,
  download_url TEXT,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
);

-- Events table
CREATE TABLE events (
  id VARCHAR(36) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date VARCHAR(50) NOT NULL,
  time VARCHAR(50) NOT NULL,
  location TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  capacity VARCHAR(20),
  registration_url TEXT,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type)
);

-- Gallery table
CREATE TABLE gallery (
  id VARCHAR(36) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(10) NOT NULL DEFAULT 'image',
  date VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'Geral',
  views INT DEFAULT 0,
  duration VARCHAR(20),
  thumbnail TEXT,
  media_url TEXT,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_category (category)
);

-- Reports table
CREATE TABLE reports (
  id VARCHAR(36) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  period VARCHAR(50) NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_status (status)
);

-- Settings table
CREATE TABLE settings (
  id VARCHAR(36) PRIMARY KEY,
  `key` TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE members (
  id VARCHAR(36) PRIMARY KEY,
  member_number VARCHAR(20),
  full_name TEXT NOT NULL,
  birth_date VARCHAR(50) NOT NULL,
  birth_place TEXT NOT NULL,
  nationality VARCHAR(50) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  marital_status VARCHAR(20) NOT NULL,
  id_document VARCHAR(50) NOT NULL,
  id_issue_date VARCHAR(50) NOT NULL,
  id_issue_place TEXT NOT NULL,
  father_name TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  occupation TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  current_address TEXT NOT NULL,
  municipality TEXT NOT NULL,
  work_province TEXT NOT NULL,
  email TEXT NOT NULL,
  photo_url TEXT,
  other_info TEXT,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email(255)),
  INDEX idx_member_number (member_number)
);

-- Slideshow table
CREATE TABLE slideshow (
  id VARCHAR(36) PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  `order` INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order (order),
  INDEX idx_active (is_active)
);

-- Activity Plans table
CREATE TABLE activity_plan (
  id VARCHAR(36) PRIMARY KEY,
  year VARCHAR(4) NOT NULL,
  title TEXT NOT NULL DEFAULT 'Plano de Atividades',
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_year (year),
  INDEX idx_active (is_active)
);

-- Activity Plan Items table
CREATE TABLE activity_plan_items (
  id VARCHAR(36) PRIMARY KEY,
  plan_id VARCHAR(36) NOT NULL,
  number INT NOT NULL,
  activity TEXT NOT NULL,
  date TEXT,
  time TEXT,
  location TEXT,
  participants TEXT,
  `order` INT NOT NULL DEFAULT 0,
  parent_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES activity_plan(id) ON DELETE CASCADE,
  INDEX idx_plan_id (plan_id),
  INDEX idx_order (order)
);

-- Social Organs table
CREATE TABLE orgaos_sociais (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  position VARCHAR(100) NOT NULL,
  organ_type VARCHAR(50) NOT NULL,
  bio TEXT,
  photo_url TEXT,
  email TEXT,
  phone VARCHAR(20),
  order_index INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_organ_type (organ_type),
  INDEX idx_active (is_active),
  INDEX idx_order (order_index)
);

-- Contact Messages table
CREATE TABLE contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_read (is_read)
);

-- Notifications table
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  related_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  INDEX idx_type (type),
  INDEX idx_is_read (is_read),
  INDEX idx_related_id (related_id)
);

-- Create admin user (senha: admin123)
INSERT INTO users (id, username, email, password, role, is_active, created_at, updated_at) VALUES
(UUID(), 'admin', 'admin@anpere.ao', '$2a$10$9QG3DZxKhQvJWvL3VZl5XeK0v/JXV5Bjz3JqQ3zQeJQvQeJQvQeJq', 'admin', TRUE, NOW(), NOW());

-- Insert default about content
INSERT INTO about_content (id, section, title, content, updated_at) VALUES
(UUID(), 'mission', 'A Nossa Missão', 'Representar e defender os interesses profissionais, sociais e económicos dos profissionais do espectro rádio eletrónico em Angola.', NOW()),
(UUID(), 'vision', 'A Nossa Visão', 'Ser a referência nacional na representação e valorização dos profissionais do espectro rádio eletrónico.', NOW()),
(UUID(), 'values', 'Os Nossos Valores', 'Ética, Profissionalismo, Solidariedade, Inovação e Compromisso social.', NOW());

-- Insert default timeline events
INSERT INTO timeline_events (id, year, event, description, is_active, `order`, created_at, updated_at) VALUES
(UUID(), '2023', 'Fundação da ANPERE', 'Criação da Associação Nacional dos Profissionais do Espectro Rádio Eletrónico.', TRUE, 0, NOW(), NOW()),
(UUID(), '2024', 'Primeira Assembleia Geral', 'Realização da primeira assembleia geral com a participação de membros fundadores.', TRUE, 1, NOW(), NOW());

-- Insert default slideshow
INSERT INTO slideshow (id, title, subtitle, description, image_url, `order`, is_active, created_at, updated_at) VALUES
(UUID(), 'Profissionais do Espectro Rádio Eletrónico', 'Unindo especialistas em telecomunicações de Angola', 'ANPERE representa e apoia os profissionais que trabalham com o espectro rádio eletrónico, promovendo excelência técnica e desenvolvimento profissional.', '/attached_assets/generated_images/Angolan_telecommunications_professionals_working_640a21c0.png', 0, TRUE, NOW(), NOW()),
(UUID(), 'Tecnologia e Inovação', 'Avançando nas telecomunicações angolanas', 'Contribuímos para o desenvolvimento das telecomunicações em Angola através da formação contínua e partilha de conhecimento técnico.', '/attached_assets/generated_images/Telecommunications_tower_in_Luanda_Angola_da464df4.png', 1, TRUE, NOW(), NOW());
