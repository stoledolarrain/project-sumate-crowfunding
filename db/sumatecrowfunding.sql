CREATE DATABASE IF NOT EXISTS sumatecrowfunding;
USE sumatecrowfunding;


-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('visitante', 'usuario', 'admin') DEFAULT 'usuario',
    es_valido TINYINT(1) DEFAULT 0,
    codigo_validacion VARCHAR(100),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorias
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO categorias (nombre) VALUES 
('Tecnología'), ('Social'), ('Salud'), ('Arte'), ('Negocios');

-- Tabla de Proyectos (Con las 4 fotos y estados)
CREATE TABLE proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    meta_financiera DECIMAL(10, 2) NOT NULL,
    monto_recaudado DECIMAL(10, 2) DEFAULT 0.00,
    fecha_limite DATE NOT NULL,
    
    -- fotos
    imagen_url VARCHAR(255),
    imagen2_url VARCHAR(255) DEFAULT NULL,
    imagen3_url VARCHAR(255) DEFAULT NULL,
    imagen4_url VARCHAR(255) DEFAULT NULL,
    
    -- estados
    estado_aprobacion ENUM('borrador', 'en_revision', 'observado', 'rechazado', 'publicado') DEFAULT 'borrador',
    estado_campana ENUM('no_iniciada', 'en_progreso', 'en_pausa', 'finalizada') DEFAULT 'no_iniciada',
    
    observaciones_admin TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla de Favoritos
CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    proyecto_id INT NOT NULL,
    fecha_guardado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
);

-- Tabla de Donaciones
CREATE TABLE donaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    proyecto_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id)
);


-- Datos de prueba

INSERT INTO usuarios (nombre_completo, email, password, rol, es_valido) VALUES 
('Admin', 'admin@sumate.com', '123456', 'admin', 1),
('Jose Carlos', 'jcgm@crowfunding.com', '123456', 'usuario', 1);

-- 1. Refugio Huella Animal
INSERT INTO proyectos (usuario_id, categoria_id, titulo, descripcion, meta_financiera, monto_recaudado, fecha_limite, estado_aprobacion, estado_campana, imagen_url, imagen2_url, imagen3_url, imagen4_url) VALUES 
(2, 2, 'Refugio Huella Animal', 'El Refugio Huellitas es una organización dedicada al rescate, cuidado y recuperación de animales en situación de abandono o maltrato en Santa Cruz de la Sierra.', 5000.00, 0.00, '2025-12-31', 'publicado', 'en_progreso', 
'/uploads/1764734836302-818879314.png', 
'/uploads/1764734836302-5270067.jpg', 
'/uploads/1764734836317-650665338.jpg', 
'/uploads/1764734836323-412617541.jpg');

-- 2. Techo Fundacion
INSERT INTO proyectos (usuario_id, categoria_id, titulo, descripcion, meta_financiera, monto_recaudado, fecha_limite, estado_aprobacion, estado_campana, imagen_url, imagen2_url, imagen3_url, imagen4_url) VALUES 
(2, 2, 'Techo Fundacion', 'La Fundación TECHO en Santa Cruz trabaja junto a familias que viven en condiciones de pobreza para mejorar sus hogares y su comunidad.', 1500.00, 0.00, '2025-11-30', 'publicado', 'en_progreso', 
'/uploads/1764734472246-766365658.jpg', 
'/uploads/1764734472251-557888882.jpg', 
'/uploads/1764734472255-93366666.jpg', 
'/uploads/1764734472256-337377526.jpg');

-- 3. Bomberos Voluntarios UUBR
INSERT INTO proyectos (usuario_id, categoria_id, titulo, descripcion, meta_financiera, monto_recaudado, fecha_limite, estado_aprobacion, estado_campana, imagen_url, imagen2_url, imagen3_url, imagen4_url) VALUES 
(2, 2, 'Bomberos Voluntarios UUBR', 'Los Bomberos Voluntarios UUBR de Santa Cruz trabajan incansablemente para proteger a la comunidad en situaciones de emergencia, desastres e incendios.', 3500.00, 0.00, '2025-10-15', 'publicado', 'en_progreso', 
'/uploads/1764733041082-527343938.jpg', 
'/uploads/1764733041083-939352295.jpg', 
'/uploads/1764733041087-738090968.jpg', 
'/uploads/1764733041089-433020250.jpg');

-- 4. Refugio Angelitos de EDGAR
INSERT INTO proyectos (usuario_id, categoria_id, titulo, descripcion, meta_financiera, monto_recaudado, fecha_limite, estado_aprobacion, estado_campana, imagen_url, imagen2_url, imagen3_url, imagen4_url) VALUES 
(2, 2, 'Refugio Angelitos de EDGAR', 'El Refugio Angelitos de Edgar es un espacio dedicado al rescate y cuidado de animales que han sido abandonados, heridos o maltratados.', 5000.00, 0.00, '2025-12-25', 'publicado', 'en_progreso', 
'/uploads/1764732728683-439234310.jpg', 
'/uploads/1764732728683-191899421.jpg', 
'/uploads/1764732728691-311615474.jpg', 
'/uploads/1764732728698-358660000.jpg');

-- 5. Donacion para compra de Juguetes (Solares)
INSERT INTO proyectos (usuario_id, categoria_id, titulo, descripcion, meta_financiera, monto_recaudado, fecha_limite, estado_aprobacion, estado_campana, imagen_url, imagen2_url, imagen3_url, imagen4_url) VALUES 
(2, 2, 'Donacion para compra de Juguetes', 'El señor Alfredo Solares, reconocido en Santa Cruz por su solidaridad, realiza cada año una enorme labor: llevar alegría y esperanza a cientos de niños.', 5000.00, 0.00, '2025-12-24', 'publicado', 'en_progreso', 
'/uploads/1764732060667-216188505.jpg', 
'/uploads/1764732060670-723984340.jpg', 
'/uploads/1764732060673-270889496.jpg', 
'/uploads/1764732060676-266715016.jpg');