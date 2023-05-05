import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from './pages/home'
import Nav from './components/nav'
import {fetchAllComics, fetchComics} from "./features/marvels/marvelService";
import {useDispatch, useSelector} from "react-redux";
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {MainWrapper} from "./components/styled/lib";

function App() {
    const dispatch: ThunkDispatch<{}, {}, Action> = useDispatch();
    const {comics, filteredComics, loading, error, message } = useSelector((state: any) => state.comics);

    useEffect(() => {
        dispatch(fetchAllComics());
        console.log("comics from app")
        console.log(comics)
    }, [dispatch]);
  return (
      <>
        <Router>
            <MainWrapper>
                <Nav/>
                <div className=''>
                    <Routes>
                        <Route path='/' element={<Home />} />
                    </Routes>
                </div>
            </MainWrapper>
        </Router>
      </>
  );
}

export default App;
