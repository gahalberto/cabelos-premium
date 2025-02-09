import { ReactNode } from "react";
import { FaCamera, FaHeart, FaHistory, FaInfoCircle } from "react-icons/fa";

type Props = {
    children: ReactNode,
    slug: string
}

const BrowserFrame = ({ children, slug }: Props) => {
    return (
      <div className="       w-96 max-w-2xl mx-auto border   border-gray-300 rounded-lg shadow-lg">
        <div className="flex items-center bg-gray-100 p-2 rounded-t-lg">
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <div className="flex-1 mx-4">
            <input
              type="text"
              value={`https://www.inmemorian.com/${slug}`}
              readOnly
              className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
        <div className="bg-white">{children}</div>
        <div className="flex w-max-12 items-center justify-center bottom-0 left-0 right-0 bg-slate-900 text-white shadow p-4 space-x-12 border-t">
        <button className="flex flex-col items-center text-center text-blue-500" aria-label="Biography" title="Biography">
          <FaInfoCircle className="text-xl" />
          <p className="text-sm">Biografia</p>
        </button>
        <button className="flex flex-col items-center text-center hover:text-blue-500" aria-label="Biography" title="Biography">
          <FaHistory className="text-2xl" />
          <p className="text-sm">Timeline</p>
        </button>
        <button className="flex flex-col items-center text-center hover:text-blue-500" aria-label="Biography" title="Biography">
          <FaCamera className="text-2xl" />
          <p className="text-sm">Galeria</p>
        </button>
        <button className="flex flex-col items-center text-center hover:text-blue-500" aria-label="Biography" title="Biography">
          <FaHeart className="text-2xl" />
          <p className="text-sm">Tributos</p>
        </button>
      </div>
      </div>
    );
  };
  
  export default BrowserFrame;
  