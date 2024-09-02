CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    image_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description TEXT,
    image_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


INSERT INTO users (name, email, password, image_url) VALUES
('John Doe', 'john@gmail.com', '1234', 'https://images.pexels.com/photos/26690031/pexels-photo-26690031/free-photo-of-back-view-of-atlantic-puffin-on-rock.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'),
('Jane Smith', 'jane@gmail.com', '1234', 'https://images.pexels.com/photos/26690031/pexels-photo-26690031/free-photo-of-back-view-of-atlantic-puffin-on-rock.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load');

INSERT INTO posts (user_id, description, image_url) VALUES
(1, 'This is a sample post.', 'https://images.pexels.com/photos/26690031/pexels-photo-26690031/free-photo-of-back-view-of-atlantic-puffin-on-rock.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'),
(2, 'Another sample post.', 'https://images.pexels.com/photos/26690031/pexels-photo-26690031/free-photo-of-back-view-of-atlantic-puffin-on-rock.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load');

INSERT INTO comments (post_id, user_id, text) VALUES
(1, 2, 'Nice post!'),
(2, 1, 'Great image.');