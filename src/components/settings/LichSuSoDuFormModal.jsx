import { Form, Input } from "../forms";
import { Button, Modal } from "../ui";

const DEFAULT_FORM_ID = "lich-su-so-du-form";

/**
 * Modal tạo mới / chỉnh sửa lịch sử số dư (cùng POST /api/LichSuSoDu).
 */
export function LichSuSoDuFormModal({
  isOpen,
  onClose,
  mode = "create",
  methods,
  onSubmit,
  isPending = false,
  formId = DEFAULT_FORM_ID,
}) {
  const isEdit = mode === "edit";
  const title = isEdit ? "Chỉnh sửa lịch sử số dư" : "Tạo mới lịch sử số dư";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form={formId}
            loading={isPending}
            disabled={isPending}
          >
            Lưu
          </Button>
        </>
      }
    >
      <Form
        id={formId}
        methods={methods}
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="nam"
            label="Năm"
            type="number"
            min={2000}
            max={2100}
            required
            disabled={isEdit}
          />
          <Input
            name="maTaiKhoan"
            label="Mã tài khoản"
            required
            disabled={isEdit}
          />
          <div className="sm:col-span-2">
            <Input name="tenTaiKhoan" label="Tên tài khoản" required />
          </div>
          <Input name="no" label="Nợ" type="number" step="any" />
          <Input name="co" label="Có" type="number" step="any" />
        </div>
      </Form>
    </Modal>
  );
}
