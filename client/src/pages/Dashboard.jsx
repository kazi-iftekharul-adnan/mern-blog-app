import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Button, IconButton, TextField } from '@mui/material';
import { ThumbUp, Delete } from '@mui/icons-material';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  const handlePost = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/posts', { content }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts([res.data, ...posts]);
      setContent('');
      toast.success('Post created!');
    } catch (err) {
      toast.error('Failed to create post');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(posts.filter(post => post._id !== id));
      toast.success('Post deleted!');
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out!');
    navigate('/');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <nav style={{ padding: '20px', background: '#1976d2', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <h1>Blog App</h1>
        <Button variant="contained" onClick={handleLogout}>Logout</Button>
      </nav>
      <div style={{ maxWidth: '600px', margin: '20px auto' }}>
        <TextField label="New Post" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
        <Button onClick={handlePost} variant="contained" color="primary" style={{ marginTop: '10px' }}>Post</Button>
      </div>
      <div>
        {posts.map(post => (
          <motion.div key={post._id} initial={{ y: 50 }} animate={{ y: 0 }} style={{ border: '1px solid #ccc', padding: '20px', margin: '20px auto', maxWidth: '600px' }}>
            <p>{post.content}</p>
            <IconButton onClick={() => handleDelete(post._id)}><Delete /></IconButton>
            <IconButton><ThumbUp /></IconButton> {/* Updated usage */}
          </motion.div>
        ))}
      </div>
      <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>Top</Button>
    </motion.div>
  );
};

export default Dashboard;