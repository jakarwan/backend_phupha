import Swal from "sweetalert2";

export const alertSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "สำเร็จ",
    text: message,
    confirmButtonColor: "#3085d6",
  });
};

export const alertError = (message) => {
  Swal.fire({
    icon: "error",
    title: "เกิดข้อผิดพลาด",
    text: message,
    confirmButtonColor: "#d33",
  });
};

export const alertDelete = (message) => {
  return Swal.fire({
    title: "ยืนยันการลบ?",
    text: `คุณต้องการลบข้อมูล ${message.member_id} หรือไม่?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ลบ",
    cancelButtonText: "ยกเลิก",
    // confirmButtonColor: '#e3342f',
    didOpen: () => {
      const confirmBtn = Swal.getConfirmButton();
      confirmBtn.style.color = "white";
      confirmBtn.style.backgroundColor = "red";

      const cancelBtn = Swal.getCancelButton();
      cancelBtn.style.color = "white";
    },
  });
};
