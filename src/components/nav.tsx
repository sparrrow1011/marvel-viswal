import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {searchComic, handleFavouriteComic, removeAllFavouriteComics} from "../features/marvels/marvelService";
// import { Header, SidebarWrapper } from './styled/lib';
import { AiOutlineHeart, AiFillCloseCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import {
    Column, FavComicCardImgWrapper, FavComicCardWrapper,
    Header,
    LikeButtonComic, LikeButtonFavComic, RemoveAllFavouriteComic,
    Row,
    SidebarWrapper,
    TopDiv,
    TopLeftTextDiv,
    TopText,
    TopTextDiv
} from "./styled/lib";

interface NavProps {
    setter: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const Nav = () => {
    const {favouritesComics, filteredComics, loading, error, message } = useSelector((state: any) => state.comics);

    const dispatch = useDispatch();

    const [searchData, setSearchData] = useState("");
    const [showSidebar, setShowSidebar] = useState(false);
    useEffect(() => {
        dispatch(searchComic(searchData));
    }, [searchData]);
    const [liked, setLiked] = useState(true);

    const handleLikeClick = (comic: any) => {
        setLiked(!liked);
        dispatch(handleFavouriteComic(comic));
    };

    return (
        <Header>
            <div>
                <><TopText color={`#c12729`}>.</TopText></>
                <Column>
                    <img src="/marvel_logo.png" alt="" />
                        <input
                            className="form-control me-2 w-50"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchData}
                            onChange={(e) => setSearchData(e.target.value)}
                        />
                </Column>
                <SidebarWrapper>
                    {showSidebar ? (
                        <LikeButtonComic onClick={() => setShowSidebar(!showSidebar)}>
                            {' '}
                            Favourites <AiOutlineHeart />{' '}
                        </LikeButtonComic>
                    ) : (
                        <LikeButtonComic onClick={() => setShowSidebar(!showSidebar)}>
                            Favourites <AiOutlineHeart />{' '}
                        </LikeButtonComic>
                    )}

                    <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
                        <Column>
                            <TopDiv>
                                <TopTextDiv>
                                    <TopText color={`#c12729`}>My Favourite</TopText>
                                </TopTextDiv>
                                <TopLeftTextDiv>
                                    <RemoveAllFavouriteComic onClick={() => dispatch(removeAllFavouriteComics())}>
                                        Clear all
                                    </RemoveAllFavouriteComic>
                                    <LikeButtonComic onClick={() => setShowSidebar(!showSidebar)}>
                                        {' '}
                                        <AiFillCloseCircle color={`black`} />{' '}
                                    </LikeButtonComic>
                                </TopLeftTextDiv>
                            </TopDiv>
                            {favouritesComics.map((comic:any) => {
                                const thumbnailSplit = comic.thumbnail.path.split('//');
                                thumbnailSplit[0] = 'https://';
                                return (
                                    <FavComicCardWrapper >
                                        <div>
                                            <FavComicCardImgWrapper backgroundImage={`${thumbnailSplit.join('')}.${comic.thumbnail.extension}`}/>
                                            <h2>{comic.title}</h2>
                                        </div>

                                        <LikeButtonFavComic onClick={() => handleLikeClick(comic)} >
                                            '❤️'
                                        </LikeButtonFavComic>
                                    </FavComicCardWrapper>
                                )
                            })}
                        </Column>
                    </div>
                </SidebarWrapper>
                </div>
        </Header>
    );
};
export default Nav;
