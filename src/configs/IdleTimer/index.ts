"use client";

// next js
import { useRouter } from "next/navigation";

// import plugins
import { useIdleTimer } from "react-idle-timer";

export const useConfigIdleTimer = () => {
  // use router dari next js
  const router = useRouter();

  // handle action ketika tidak ada aktifitas selama waktu yang telah di tentukan
  const handleOnIdle = () => {
    router.push("/login");
  };

  //   handle ketika user masih aktif
  const handleOnActive = (event: any) => {
    console.log("user is active", event);
    console.log("time remaining", getRemainingTime());
  };

  //   handle user jika ada aksi
  const handleOnAction = (event: any) => {
    console.log("user did something", event);
  };

  const { getRemainingTime } = useIdleTimer({
    timeout: 1000 * 5,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  });
};