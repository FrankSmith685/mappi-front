/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { ResenaById } from '../../../../interfaces/resena';
import { useUser } from '../../../../hooks/useUser';
import { UserAll } from '../../../../interfaces/user';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { imageBaseUrl } from '../../../../api/apiConfig';
import FullScreenImageViewer from './gallery/imageGallery';

interface ReviewListProps {
  reviews: ResenaById[];
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const formatDateOne = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
  }).format(date);
};

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const { getAllUser } = useUser();
  const [dataUsers, setDataUsers] = useState<UserAll[]>([]);

  const [showViewer, setShowViewer] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUser();
        if (data) setDataUsers(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchData();
  }, [reviews]);

  const total = reviews.reduce((acc, curr) => acc + Number(curr.calificacion), 0);
  const promedio = (total / reviews.length).toFixed(2);

  const truncateText = (text: string, maxLength: number) =>
    text && text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <div className="pb-12 px-4 sm:px-6 md:px-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
          Opiniones de Usuarios
        </h3>
        <span className="text-base text-gray-700 mt-2 sm:mt-0">
          <strong className="text-custom-primary">Promedio:</strong> {promedio}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-1">
        {reviews.map((review, index) => {
          const user = dataUsers.find((u) => u.id === review.idUsuario);
          const userName = user?.nombre || 'Usuario';

          const imageIds = review?.multimediaIds
            ? review.multimediaIds.split(',').map((id) => id.trim())
            : [];

          return (
            <div
              key={index}
              className="bg-white hover:shadow-xl transition-all duration-300 p-6 rounded-2xl border border-gray-100 shadow-md hover:scale-[1.02]"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-custom-primary-v2 text-white flex items-center justify-center font-bold mr-4 text-lg shadow-inner shadow-yellow-500/30">
                  {getInitials(userName)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">
                    {formatDateOne(review?.fecha?.toString() || '')}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-5 w-5 transition-transform duration-200 hover:scale-110 ${
                      i < Number(review.calificacion)
                        ? 'text-custom-primary'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                “{truncateText(review?.resena || '', 200)}”
              </p>

              {/* Miniaturas de imágenes */}
              {imageIds.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {imageIds.map((id, imgIndex) => {
                    const imageUrl = `${imageBaseUrl}rese_${id}`;
                    return (
                      <button
                        key={imgIndex}
                        onClick={() => {
                          setSelectedImages(imageIds.map((img) => `${imageBaseUrl}rese_${img}`));
                          setStartIndex(imgIndex);
                          setShowViewer(true);
                        }}
                        className="w-28 h-28 border border-gray-200 rounded-xl overflow-hidden hover:scale-105 transition-all duration-200"
                      >
                        <LazyLoadImage
                          src={imageUrl}
                          alt={`Reseña imagen ${imgIndex}`}
                          effect="blur"
                          className="w-full h-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-gray-400 italic mt-3">
                Escrita el {formatDate(review?.fecha || '')}
              </p>
            </div>
          );
        })}
      </div>

      {/* Visor pantalla completa */}
      {showViewer && (
        <FullScreenImageViewer
          images={selectedImages}
          onClose={() => setShowViewer(false)}
          initialIndex={startIndex}
        />
      )}
    </div>
  );
};

export default ReviewList;
