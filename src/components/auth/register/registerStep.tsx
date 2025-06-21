import CustomImage from "../../ui/CustomImage";

interface StepItem {
  step: number;
  img: string;
  title: string;
  description: string;
}

interface RegisterStepsProps {
  itemRegister: StepItem[];
}

const RegisterSteps: React.FC<RegisterStepsProps> = ({ itemRegister }) => {
  return (
    <>
      <hr className="w-full bg-custom-orange" />
      <div className="relative z-20 flex items-center justify-center bg-white pt-5">
        <div className="w-full">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 px-2">
            {itemRegister.map((item) => (
              <li
                key={item.step}
                className="flex flex-col items-center text-center text-gray-900 bg-gray-100 rounded-lg shadow-sm p-2 my-2"
              >
                <div className="relative w-12 h-12 flex items-center justify-center bg-custom-primary text-white rounded-full mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <CustomImage
                  name={item.img}
                  alt={`Paso ${item.step}`}
                  className="w-[150px] lg:w-[200px] mb-3"
                />
                <div>
                  <strong>{item.title}</strong>
                  <p className="mt-2 text-sm lg:text-base">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default RegisterSteps;
