
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './routes/Home';
import LinkedListApp from './routes/linked-list/LinkedListApp';
import TreeApp from './routes/tree/TreeApp';
import GraphApp from './routes/graph/GraphApp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/linked-list" element={<LinkedListApp />} />
        <Route path="/tree" element={<TreeApp />} />
        <Route path="/graph" element={<GraphApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
