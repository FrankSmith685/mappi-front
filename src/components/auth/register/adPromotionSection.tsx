import React from "react";
import CustomImage from "../../ui/CustomImage";

interface Feature {
  text: string;
  imageSrc?: string;
  alt?: string;
}

interface AdPromotionSectionProps {
  title: string;
  features: Feature[];
  registrationText: string;
}

const AdPromotionSection: React.FC<AdPromotionSectionProps> = ({
  title,
  features,
  registrationText,
}) => {
  return (
    <section className="text-center text-white">
      <h2 className="text-4xl">
        {title.split(" ").map((word, index) =>
          word === "plataforma" ? (
            <strong key={index}> {word} </strong>
          ) : (
            ` ${word} `
          )
        )}
      </h2>

      <ul className="px-2 py-7 space-y-3 flex flex-col items-center">
        {features.map((feature, index) => (
          <li
            key={index}
            className="w-full max-w-md sm:max-w-lg font-bold flex items-center justify-start py-2 sm:px-6 space-x-4"
          >
            {feature.imageSrc && (
              <CustomImage
                    name={feature.imageSrc}
                    alt={feature.imageSrc}
                    className={`w-auto h-10 md:h-14`}
                />
            )}
            <span className="text-base font-medium text-white px-2 py-1 text-start">
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="text-4xl mb-7">{registrationText}</h2>

      <div className="w-full p-0 overflow-hidden h-auto flex justify-center items-center">
        <div className="bg-yellow-500 text-center text-lg w-40 rounded-xl py-4 text-black shadow-lg transform transition hover:scale-105">
          <div className="text-3xl font-extrabold leading-none mb-1">30</div>
          <div className="text-xl font-medium">Días</div>
          <div className="text-lg font-light">Gratis</div>
        </div>
      </div>
    </section>
  );
};

export default AdPromotionSection;
