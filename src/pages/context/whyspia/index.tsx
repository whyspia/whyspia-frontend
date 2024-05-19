import DefaultLayout from 'components/layouts/DefaultLayout'

const WhyspiaPage = () => {


  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <>
        <h1 className="text-4xl font-bold mb-8">
          whyspia
        </h1>

        

      </>
    </div>
  )
}

(WhyspiaPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default WhyspiaPage