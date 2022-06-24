import React from 'react';
import { App } from '../app/app';
import { HashRouter, Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { MoviePage } from '../moviePage/moviePage';

export const Main = ({ }) => {
    return (
        <HashRouter>
            <Routes>
                <Route path='/card/:id' element={<MoviePage />} />
                <Route path='/' element={<App />} />
                {/* <Route path='/hello' element={<App />} /> */}
            </Routes>
        </HashRouter>
    )
}