import { useCouponsApi } from "@/hooks/useCouponsApi";
import { useFirebase } from "@/hooks/useFirebase";
import { useUpload } from "@/hooks/useUpload";
import {
  Box,
  Card,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import * as Crypto from "crypto";
import { Plus, Spinner } from "phosphor-react";
import { useMemo, useState } from "react";

const ImageUploadInput = (props: {
  projectId: string;
  onUploaded(url: string): void;
}) => {
  const { authToken } = useFirebase();
  const { callGetUploadUrl } = useCouponsApi();
  const { uploadFile, getImageSize } = useUpload();
  const [inputKey, setInputKey] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const uiKey = useMemo(() => {
    return `input_${Crypto.randomBytes(20).toString("hex")}`;
  }, []);

  const handleFileChange = (evt: any) => {
    if (!evt) return;
    if (!evt.target) return;
    if (!evt.target.files) return;
    if (evt.target.files.length <= 0) return;
    const file = evt.target.files[0];

    uploadImage(authToken!, props.projectId, file);
  };

  const uploadImage = async (
    authToken: string,
    projectId: string,
    file: File
  ) => {
    setIsLoading(true);
    try {
      checkImageSize(file);
      const { getUrl, uploadUrl } = await callGetUploadUrl(
        authToken,
        projectId,
        file.type
      );
      const resp = await uploadFile(uploadUrl, file);
      setPreviewUrl(getUrl);
      setInputKey(Date.now());
      props.onUploaded(getUrl);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkImageSize = async (file: File): Promise<boolean> => {
    const { width, height } = await getImageSize(file);
    if (width === undefined || height === undefined) {
      throw new Error("Failed to load image.");
    }
    if (5120 < width || 5120 < height) {
      throw new Error("Failed to load image.");
    }
    return true;
  };

  return (
    <Box mb={8}>
      <FormControl>
        <FormLabel htmlFor={uiKey}>
          Coupon Image
          <Text fontSize="sm">(1024px x 1024px)</Text>
          <Input
            id={uiKey}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            display="none"
            key={inputKey}
          />
          <Card
            width={256}
            height={256}
            bg="gray.200"
            align="center"
            justify="center"
          >
            {isLoading && (
              <Spinner size={24}>
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  dur="1.8s"
                  from="0 0 0"
                  to="360 0 0"
                  repeatCount="indefinite"
                ></animateTransform>
              </Spinner>
            )}
            {!isLoading && previewUrl && (
              <Image src={previewUrl} alt="Preview" w="100%" h="100%" />
            )}
            {!isLoading && !previewUrl && <Plus size={24} color="gray" />}
          </Card>
        </FormLabel>
      </FormControl>
    </Box>
  );
};

export default ImageUploadInput;
