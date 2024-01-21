import 'ldrs/dotPulse'
import 'ldrs/bouncy'



const messageList=[
  "Take a coffee break",
  "Drink some water",
  "So what are you doing?",
]

export default async function Loading() {
  return (
    <>
      <div className="w-screen h-screen grid place-items-center">
        <div className="flex flex-col items-center">
          <div>
            <l-bouncy size="48" speed="1.75" color="#585858"></l-bouncy>
          </div>
          <div className="text-lg text-[#585858] mt-2 flex gap-2 items-baseline">
              {messageList[Math.floor(Math.random()*messageList.length)]}<l-dot-pulse size={25} speed={1.5} color="#585858"></l-dot-pulse>
          </div>
        </div>
      </div>
    </>
  );
}
