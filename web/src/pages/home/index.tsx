import { Applications } from './applications';
import { Banner } from './banner';
import { Datasets } from './datasets';

const Home = () => {
  return (
    <section className="px-8 pb-8">
      <Banner></Banner>
      <section className="h-[calc(100dvh-300px)] overflow-auto">
        <Datasets></Datasets>
        <Applications></Applications>
      </section>
    </section>
  );
};

export default Home;
