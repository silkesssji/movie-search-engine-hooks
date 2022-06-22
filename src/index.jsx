import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.scss';
import { App } from './components/app/app';


const queryParams = new URLSearchParams(window.location.search)

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <App initialQueryParams={queryParams} />
    </BrowserRouter>
    // </React.StrictMode>
);
