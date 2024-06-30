
const Loader = ({loading}) => {

  if(!loading) return null

  return (
    <div className="z-20 w-screen h-screen bg-gray-400 flex justify-center items-center ">Loading... </div>
  )
}

export default Loader