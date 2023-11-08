/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PuzzleAccount from '../models/account';
import behindBuildingImg from '../assets/behind_building.svg';
import inWeedsImg from '../assets/in_weeds.svg';
import Opponent from '../components/Opponent';
import PageHeader from '../components/PageHeader';
import Wager from '../components/Wager';
// import { useRequestCreateEvent } from "@puzzlehq/sdk";

function AnswerSection() {
  const location = useLocation();
  const answer = location.state?.answer ?? 'N/A';

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='mt-9 flex w-[298px] max-w-full items-start justify-between gap-5 self-center'>
        <div className='flex flex-col self-start'>
          <img
            loading='lazy'
            src={inWeedsImg}
            className={`aspect-square w-full self-stretch overflow-hidden rounded-[50%] object-cover object-center
                        ${answer === 'In Weeds' ? '' : 'opacity-40'}`}
            alt='In Weeds'
          />
          <div
            className={`mt-2.5 self-center whitespace-nowrap text-center text-sm font-extrabold tracking-tight
                        ${answer === 'In Weeds' ? '' : 'opacity-40'}
                        ${
                          answer === 'In Weeds' ? 'text-green' : 'text-white'
                        }`}
          >
            In Weeds
          </div>
        </div>
        <div className='flex flex-col self-start'>
          <img
            loading='lazy'
            src={behindBuildingImg}
            className={`aspect-square w-full self-stretch overflow-hidden rounded-[50%] object-cover object-center
                        ${answer === 'Behind Building' ? '' : 'opacity-40'}`}
            alt='Behind Building'
          />
          <div
            className={`mt-2.5 self-center whitespace-nowrap text-center text-sm font-extrabold tracking-tight
                        ${answer === 'Behind Building' ? '' : 'opacity-40'}
                        ${
                          answer === 'Behind Building'
                            ? 'text-green'
                            : 'text-white'
                        }`}
          >
            Behind Building
          </div>
        </div>
      </div>
      <div className='mt-8 self-center whitespace-nowrap text-center text-sm font-extrabold tracking-tight text-green'>
        You chose to hide Alex {answer}!
      </div>
    </div>
  );
}

type Props = {
  account: PuzzleAccount;
};

function ConfirmStartGame({ account }: Props) {
  // const account: PuzzleAccount = {
  //     network: 'aleo',
  //     chainId: '1',
  //     address: 'aleo1asu88azw3uqud282sll23wh3tvmvwjdz5vhvu2jwyrdwtgqn5qgqetuvr6',
  //     shortenedAddress: '123456'
  // };
  const navigate = useNavigate();
  const location = useLocation();
  const opponent = location.state?.opponent ?? 'N/A';
  const answer = location.state?.answer ?? 'N/A';
  const amount = location.state?.amount ?? 'N/A';
  const player_account = account.address;
  const [gameMultisig, setGameMultisig] = useState<string>('');
  const [eventID, setEventID] = useState<string>('');
  const [seed, setSeed] = useState<Uint8Array>(new Uint8Array());
  // const { requestCreateEvent, eventId, error, loading } = useRequestCreateEvent({
  //     type: 'Execute',
  //     programId: 'cflip_gm_aleo_testing_123.aleo',
  //     functionId: 'propose_game',
  //     fee: 10000,
  //     inputs: "1",
  // })

  useEffect(() => {
    function generateGameMultisig(
      opponent: string,
      player_account: string
    ): { gameMultisig: string; seed: Uint8Array } {
      // Our logic to generate gameMultisig and seed using hooks to wallet wasm
      return {
        gameMultisig: 'ms_' + opponent + player_account, // example outputs
        seed: new Uint8Array(),
      };
    }
    const result = generateGameMultisig(opponent, player_account);
    setGameMultisig(result.gameMultisig);
    setSeed(result.seed);
  }, [opponent, player_account]);

  useEffect(() => {
    if (eventID) {
      navigate('/game-started', {
        state: { gameMultisig, eventID },
      });
    }
  }, [eventID, navigate, gameMultisig]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const proposeGame = (
    opponent: string,
    player_account: string,
    gameMultisig: string,
    seed: Uint8Array,
    amount: number,
    answer: string
  ) => {
    const result =
      opponent +
      player_account +
      gameMultisig +
      seed.toString() +
      amount.toString() +
      answer;
    // requestCreateEvent()
    setEventID(result);
  };

  const navigateBackToStartWager = () => {
    navigate('/start-wager', {
      state: { opponent, answer, amount },
    }); // Navigate to the start-wager page
  };

  return (
    <main className='flex h-full flex-col justify-between bg-neutral-900'>
      <div className='flex w-full flex-col items-center bg-neutral-900 px-5 gap-8'>
        <PageHeader bg='bg-pink-300' text='REVIEW AND KICKOFF GAME' />
        <Opponent opponent={opponent} />
        <Wager wagerAmount={amount} />
        <AnswerSection />
      </div>
      <div>
        <button
          onClick={() =>
            proposeGame(
              opponent,
              player_account,
              gameMultisig,
              seed,
              amount,
              answer
            )
          }
          className={`mt-4 w-full self-center self-stretch whitespace-nowrap rounded-[200px] bg-green
                            p-5 text-center text-3xl font-extrabold tracking-tight text-black max-md:ml-px max-md:mt-10`}
        >
          KICKOFF GAME!
        </button>
        <button
          onClick={navigateBackToStartWager}
          className={`mt-4 w-full self-center self-stretch whitespace-nowrap rounded-[200px] bg-gray
                    p-5 text-center text-3xl font-extrabold tracking-tight text-black max-md:ml-px max-md:mt-10`}
        >
          BACK
        </button>
      </div>
    </main>
  );
}

export default ConfirmStartGame;
