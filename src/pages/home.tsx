import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomModal from "../components/modal/CustomModal";
import { handleFavouriteComic, onNavigateNext, onNavigatePrev} from "../features/marvels/marvelService"
import {AiOutlineEye, AiOutlineHeart} from 'react-icons/ai'
import {
    CharacterListWrapper,
    ComicCardWrapper,
    Content, EachButton,
    EyeComic, HomeColumn, LikeButtonComic,
    LoadingDiv,
    PaginationButtonWrapper
} from "../components/styled/lib";



function Home(props: {}) {
    const dispatch = useDispatch();

    const [id, setId] = useState<number | null>(null);

    const [showPopup, setShowPopup] = useState(false);

    const {comics, filteredComics,favouritesComics, loading, comicsPerPage, currentPage,  error, message } = useSelector((state: any) => state.comics);

    const [liked, setLiked] = useState<boolean>(favouritesComics.includes(comics.id));


    useEffect(() => {
        console.log("comics from home")
        console.log(allComics)
    }, [id, favouritesComics]);
    if (loading) {
        return <LoadingDiv>Loading...</LoadingDiv>;
    }


    const allComics = comics?.map((comic:any) => ({
        id:comic.id, title: comic.title, thumbnail: comic.thumbnail
    })) ?? [];

    const totalPages = Math.ceil(comics.length / 12);

    const navigatePrev = () => {
        if (currentPage !== 1) {
            dispatch(onNavigatePrev());
        }
    };

    const navigateNext = () => {
        if (currentPage !== totalPages) {
            dispatch(onNavigateNext());
        }
    };

    const handleLikeClick = (comic: any) => {
        setLiked(!liked);
        dispatch(handleFavouriteComic(comic));
    };

    const displayComics = () => {
        const allComics = comics.slice((currentPage - 1) * comicsPerPage, currentPage * comicsPerPage);
        return allComics &&
                allComics
                    .filter((comic: { title: string; }) => {
                        if (!filteredComics || filteredComics.length === 0) {
                            return comic;
                        } else {
                            return comic.title
                                .toLowerCase()
                                .includes(filteredComics.toLowerCase());
                        }
                    })
                    .map((comic: { title: string, id: any, thumbnail:any, liked:any }) => {
                        const thumbnailSplit = comic.thumbnail.path.split('//');
                        thumbnailSplit[0] = 'https://';
                        return(
                            <ComicCardWrapper backgroundImage={`${thumbnailSplit.join('')}.${comic.thumbnail.extension}`}>
                                <div>
                                    <Content>
                                        <LikeButtonComic  onClick={() => handleLikeClick(comic)} >
                                            {liked ? '❤️' : <AiOutlineHeart />}
                                        </LikeButtonComic>
                                        <EyeComic  onClick={() => [setId(comic.id), setShowPopup(true)]}>
                                            <AiOutlineEye />
                                        </EyeComic>
                                        <h2>{comic.title}</h2>
                                    </Content>
                                </div>
                            </ComicCardWrapper>
                        )
                    })};

    return (
        <div>
            {showPopup && (
                <CustomModal
                    id={id}
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                />
            )}
            <HomeColumn>
                <CharacterListWrapper>
                    {displayComics()}
                </CharacterListWrapper>
                <PaginationButtonWrapper>
                    <EachButton onClick={navigatePrev}>
                        PREVIOUS PAGE
                    </EachButton>
                    <EachButton onClick={navigateNext}>
                        NEXT PAGE
                    </EachButton>
                </PaginationButtonWrapper>
            </HomeColumn>

        </div>
    );
}

export default Home;
