import { useTranslation } from 'react-i18next';

export function Banner() {
  return (
    <section className="bg-[url('@/assets/banner.png')] bg-cover h-28 rounded-2xl  my-8 flex gap-8 justify-between">
      <div className="h-full text-3xl font-bold items-center inline-flex ml-6">
        Welcome to RAGFlow
      </div>
    </section>
  );
}

export function NextBanner() {
  const { t } = useTranslation();
  return (
    <section className="text-4xl py-8 font-bold px-8">
      <span className="text-text-primary">{t('header.welcome')}</span>
      <span className="pl-3 text-transparent bg-clip-text  bg-gradient-to-l from-[#40EBE3] to-[#4A51FF]">
        RAGFlow
      </span>
    </section>
  );
}
