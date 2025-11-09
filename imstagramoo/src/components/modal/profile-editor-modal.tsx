import Fallback from "@/components/fallback";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useProfileEditorModal } from "@/store/profile-editor-modal";
import { useSession } from "@/store/session";
import { DialogTitle } from "@radix-ui/react-dialog";
import defaultAvatar from "@/assets/default-profile.png";
import { Input } from "@/components/ui/input";

export default function ProfileEditorModal() {
  const session = useSession();
  const {
    data: profile,
    error: fetchProfileError,
    isPending: isFetchProfilePending,
  } = useProfileData(session?.user.id);
  const profileEditorModal = useProfileEditorModal();
  const openAlertModal = useOpenAlertModal();
  // useState 초기값은 session 정보로
  // session정보 없으면? 어느 타이밍에 return 할건데?
  // useEffect로 처리하는건가
  const handleCloseModal = () => {};
  const handlesaveButton = () => {
    // session정보와 useState정보가 다를때만
    if (profile?.avatar_url) {
      openAlertModal({
        title: "프로필 수정이 완료되지 않았습니다.",
        description: "이 화면에서 나가면 수정중이던 내용이 사라집니다.",
        onPositive: () => {
          profileEditorModal.actions.close();
        },
      });
      return;
    }
    profileEditorModal.actions.close();
  };
  return (
    <Dialog open={profileEditorModal.isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="flex flex-col gap-5">
        <DialogTitle>프로필 수정하기</DialogTitle>
        {fetchProfileError && <Fallback />}
        {isFetchProfilePending && <Loader />}
        {!fetchProfileError && !isFetchProfilePending && (
          <>
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">프로필 이미지</div>
              <img
                src={profile.avatar_url || defaultAvatar}
                className="h-20 w-20 cursor-pointer rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">닉네임</div>
              <Input />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">bi0</div>
              <Input />
            </div>
            <Button onClick={handlesaveButton} className="cursor-pointer">
              수정하기
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
