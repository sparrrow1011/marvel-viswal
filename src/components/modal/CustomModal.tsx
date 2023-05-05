import React from "react";
import { useSelector } from "react-redux";
import {
  CloseModalButton,
  Each, ModalBackground, ModalContainer,
  ModalContent,
  ModalContentRow,
  ModalDescRow,
  ModalImg,
  ModalWrapper
} from "../styled/lib";
import { MdPlayCircle } from 'react-icons/md';
interface CustomModalProps {
  id: any;
  showPopup: boolean;
  setShowPopup: (showPopup: boolean) => void;
}
const CustomModal = ({ id, showPopup, setShowPopup }: CustomModalProps) => {
  const {comics, searchData, loading, error, message } = useSelector((state: any) => state.comics);
  const allComics = comics?.map((comic:any) => ({
    id:comic.id,
    title: comic.title,
    thumbnail: comic.thumbnail,
    prices: comic.prices.price,
    genre: comic.format,
    description: comic.description
  })) ?? [];
  const singleComic = allComics.filter((comic:CustomModalProps) => comic.id === id);
  console.log("comic", singleComic);
  const thumbnailSplit = singleComic[0].thumbnail.path.split('//');
  thumbnailSplit[0] = 'https://';
  return (
    <ModalBackground>
      <ModalContainer>
          <ModalWrapper>
            <ModalImg src={`${thumbnailSplit.join('')}.${singleComic[0].thumbnail.extension}`} alt='thumb' />
            <ModalContent>
              <ModalContentRow>
                <h2>{singleComic[0].title}</h2>
              </ModalContentRow>
              <ModalDescRow>
                <Each>
                  <h2>Genre</h2>
                  <p>{singleComic[0].format}</p>
                </Each>
                <Each>
                  <h2>Price</h2>
                  <p>${singleComic[0].prices}</p>
                </Each>
                <Each>
                  <h2>Length</h2>
                  <p>120mins</p>
                </Each>
              </ModalDescRow>
              <Each>
                <h2>Public</h2>
                <p>4.5</p>
              </Each>
              <p>{singleComic[0].description}</p>
              <button>Join Now <MdPlayCircle/></button>
            </ModalContent>
            <CloseModalButton
                aria-label='Close modal'
                onClick={() => setShowPopup(false)}
            />
          </ModalWrapper>
      </ModalContainer>
    </ModalBackground>
  );
};

export default CustomModal;
