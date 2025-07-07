import React from 'react';
import Spinner from '../assets/img/Spinner.svg';
import SpinnerWhite from '../assets/img/Spinner-white.svg';
import LoadingDots from '../assets/img/LoadingDots.svg';

interface LoaderProps {
  text?: string;
  loading: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ text, loading }) => {
  if (loading) {
    return (
      <img
        src={Spinner}
        alt="Loading..."
        className="w-6 h-6 scale-150"
      />
    );
  } else {
    return <>{text}</>;
  }
};

interface Loader2Props {
  text?: string;
  loadText?: string;
  loading: boolean;
  white?: boolean;
  type?: 'dots' | 'spinner';
}

export const Loader2: React.FC<Loader2Props> = ({
  text,
  loadText = '',
  loading,
  white = false,
  type = 'dots',
}) => {
  if (loading && type === 'spinner') {
    return (
      <span className="flex flex-row">
        <img
          src={white ? SpinnerWhite : Spinner}
          alt="Loading..."
          className="scale-150 ml-auto"
        />
        <span className="mr-auto">{loadText || ''}</span>
      </span>
    );
  }

  if (!loadText && loading) {
    return (
      <span>
        <img
          src={LoadingDots}
          alt="Loading..."
          className="h-5 scale-[2] ml-4 py-0"
        />
      </span>
    );
  }

  if (loading) {
    return (
      <span className="flex flex-row">
        <img
          src={white ? SpinnerWhite : Spinner}
          alt="Loading..."
          className="scale-150 ml-auto"
        />
        <span className="mr-auto">{loadText || ''}</span>
      </span>
    );
  }

  return <span className="h-5">{text}</span>;
};

export default Loader;
