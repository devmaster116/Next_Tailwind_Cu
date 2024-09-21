export const EditOrderTypes = () => {
  return (
    <div className="w-full">
          <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] text-gray-800 ">
              You can configure your register screen depending on your preferences.
          </p>
          <div className="mt-5 lg:mt-8">
              <div className="border-b border-gray-200">
                  <div className="flex mb-4 lg:mb-5 gap-5 justify-between">
                        <div className="flex flex-col  gap-1 ">
                          <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                            Show item images on register
                          </p>
                          <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                            Enabling this means item images will be shown on the register screen
                          </p>
                        </div>

                        <div className="flex flex-col">
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" ></input>
                            <div className="relative w-11 lg:w-14 h-6 lg:h-7 bg-gray-200 rounded-full    dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full lg:after:h-6 after:h-5 lg:after:w-6 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                  </div>
              </div>

              <div className="flex mt-4 lg:mt-5 gap-5 justify-between">
                        <div className="flex flex-col  gap-1 ">
                          <p className="text-gray-700 font-semibold text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px]">
                           Show open cash draw button
                          </p>
                          <p className="font-normal text-gray-600 text-[14px] leading-[20px] lg:text-[16px] lg:leading-[24px]">
                            Enabling this allows users with access to the draw to open it outside of a transaction.
                          </p>
                        </div>

                        <div className="flex flex-col">
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" ></input>
                            <div className="relative w-11 lg:w-14 h-6 lg:h-7 bg-gray-200 rounded-full    dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full lg:after:h-6 after:h-5 lg:after:w-6 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                </div>

           </div>
     
    </div>
  );
};
