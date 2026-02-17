import React, { useState, useEffect } from "react";
import { copy, loader, tick } from "../assets";
import linkIcon from "../assets/link.svg"; 
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: article.url });
    
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles.filter(item => item.url !== article.url)];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyValue) => {
    setCopied(copyValue);
    navigator.clipboard.writeText(copyValue);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className='mt-16 w-full max-w-xl'>
      <div className='flex flex-col w-full gap-2'>
        <form
          className='relative flex justify-center items-center'
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt='link_icon'
            className='absolute left-0 my-2 ml-3 w-5 object-contain'
          />

          <input
            type='url'
            placeholder='Paste the article link'
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className='url_input peer' 
          />

          <button
            type='submit'
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'
          >
            <p>↵</p>
          </button>
        </form>

        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className='link_card'
            >
              <div className='copy_btn' onClick={(e) => {
                e.stopPropagation();
                handleCopy(item.url);
              }}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt='copy_icon'
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-black text-center'>
            Something went wrong...
            <br />
            <span className='font-satoshi font-normal text-gray-700 text-sm'>
              {error?.data?.error || "This page doesn't have clear article text to summarize."}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <div className="flex justify-between items-center">
                <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                  Article <span className='blue_gradient'>Summary</span>
                </h2>
                <button 
                  className="copy_btn" 
                  onClick={() => handleCopy(article.summary)}
                >
                  <img
                    src={copied === article.summary ? tick : copy}
                    alt='copy_icon'
                    className='w-[40%] h-[40%] object-contain'
                  />
                </button>
              </div>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700 leading-relaxed'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <footer className='mt-20 w-full flex flex-col items-center pb-12'>
        <div className='w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8 opacity-20' />
        
        <div className='flex flex-col items-center gap-3'>
          <p className='font-satoshi text-gray-400 text-lg sm:text-xl font-medium'>
            Architected & Designed by{' '}
            <span className='blue_gradient font-bold cursor-pointer'>
              Kuverdeep Pundir
            </span>
          </p>

          <div className='flex items-center gap-2'>
            <span className='h-2 w-2 rounded-full bg-[#007bff] shadow-[0_0_10px_#007bff]' />
            
            <p className='text-gray-500 font-inter text-xs sm:text-sm tracking-tight'>
              © 2026 | Full Stack Developer
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Demo;