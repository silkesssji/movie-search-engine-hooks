import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { App } from './components/app/app';


const queryParams = new URLSearchParams(window.location.search)

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App initialQueryParams={queryParams} />);
