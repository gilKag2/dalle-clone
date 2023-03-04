import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FormField, Loader } from '../components';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import Details from '../components/Details';

const PARAGRAPH_TEXT = `Create imaginative and visually stunning images through DALL-E AI and share them with the community`;

const CreatePost = () => {
  const [ form, setForm ] = useState({ name: '', prompt: '', photo: '' });
  const [ isGeneratingImg, setIsGeneratingImg ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const navigate = useNavigate();

  const shareWithCommunity = async (e) => {
    if (!form.prompt || !form.name || !form.photo) {
      alert('Please enter your name, prompt and genereate image');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        'http://localhost:8080/api/v1/post',
        JSON.stringify(form),
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(data);
      navigate('/');
    } catch (e) {
      console.error(e);
      alert('Failed to share with the community');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [ e.target.name ]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImg = async (e) => {
    e.preventDefault();
    if (!form.prompt) {
      alert('Please enter a prompt');
      return;
    }

    try {
      setIsGeneratingImg(true);
      const { data } = await axios.post(
        'http://localhost:8080/api/v1/dalle',
        JSON.stringify({ prompt: form.prompt }),
        { headers: { 'Content-Type': 'application/json' } });

      setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <Details title="Create" text={PARAGRAPH_TEXT} />
      <form className='mt-16 max-w-3xl' onSubmit={generateImg}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName="Your name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange} />
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="an armchair in the shape of an avocado"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className='relative bg-gray-50 border
           border-gray-300 text-gray-900
            text-sm rounded-lg focus:ring-blue-500
             focus:border-blue-500 w-64 b-3 h-64 flex
              justify-center items-center'>
            {form.photo ?
              <img src={form.photo} alt={form.prompt} className="w-full h-full object-contain" />
              :
              <img src={preview} alt="preview" className='w-9/12 h-9/12 object-contain opacity-40' />
            }
            {isGeneratingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className='mt-5 flex gap-5'>
          <button
            type='submit'
            onClick={generateImg}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
            {isGeneratingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#666e65] text-[14px]'>Once you have created the image you want, you can share it with others in the community</p>
          <button type='button' onClick={shareWithCommunity} className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
            {loading ? 'Sharing...' : 'Share with the community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;