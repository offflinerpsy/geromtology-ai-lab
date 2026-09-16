import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('The application root is missing.');
const application = <React.StrictMode><App initialPath={window.location.pathname} /></React.StrictMode>;
if (root.querySelector('.site-shell')) hydrateRoot(root, application);
else createRoot(root).render(application);
