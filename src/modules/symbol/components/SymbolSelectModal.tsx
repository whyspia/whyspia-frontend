import Modal from 'components/modals/Modal'
import classNames from 'classnames'
import A from 'components/A'
import { useRouter } from 'next/router'


export default function SymbolSelectModal({
  close,
  symbol = '',
}: {
  close: () => void
  symbol: string
}) {
  const router = useRouter()

  const onOptionSelected = (option: string) => {
    if (option === 'symbol') {
      router.push(`/symbol/${symbol}`)
    } else if (option === 'user') {
      router.push(`/u/${symbol}`)
    }
    

    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold">{symbol}</div>

        <div className="flex flex-wrap justify-center mt-6">
          <A
            onClick={() => onOptionSelected('symbol')}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            view symbol
          </A>

          <A
            onClick={() => onOptionSelected('user')}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            view user
          </A>
        </div>


      </div>
    </Modal>
  )
}
