import React from 'react';

const Details = ({ title, text }) => {
  return (
    <div>
      <h1 className='font-extrabold text-[#222328] text-[32px]'>{title}</h1>
      <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>{text}</p>
    </div>
  );
};

export default Details;