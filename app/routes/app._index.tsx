import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import ImportProductBanner from "./components/ImportProductBanner";
import ProductListCard from "./components/ProductListCard";

export interface ProductDataType {
  id: number;
  title: string;
  number: number;
  descriptionHtml: string | undefined;
  image: string[] | undefined;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  if ("loading" in formObject) {
    const data = [
      {
        id: 0,
        title:
          "VICHYIE Women Mock Neck Ribbed Bodycon Dress Long Sleeve Mini Pencil Dresses",
        number: Math.floor(Math.random() * 100) + 1,
        descriptionHtml: "<p>descriptionHtml</p>",
        image: ["", ""],
      },
      {
        id: 1,
        title:
          "VICHYIE Women Mock Neck Ribbed Bodycon Dress Long Sleeve Mini Pencil Dresses",
        number: Math.floor(Math.random() * 100) + 1,
        descriptionHtml: "<p>descriptionHtml</p>",
        image: ["", ""],
      },
      {
        id: 2,
        title:
          "VICHYIE Women Mock Neck Ribbed Bodycon Dress Long Sleeve Mini Pencil Dresses",
        number: Math.floor(Math.random() * 100) + 1,
        descriptionHtml: "<p>descriptionHtml</p>",
        image: ["", ""],
      },
      {
        id: 3,
        title:
          "VICHYIE Women Mock Neck Ribbed Bodycon Dress Long Sleeve Mini Pencil Dresses",
        number: Math.floor(Math.random() * 100) + 1,
        descriptionHtml: "<p>descriptionHtml</p>",
        image: ["", ""],
      },
    ];
    // 处理第二个 fetcher 的请求
    console.log("data:", data);
    return data;
  }

  return null;
};

export default function Index() {
  const [productsData, setProductsData] = useState<ProductDataType[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const loadingFetcehr = useFetcher<any>();

  const shopify = useAppBridge();

  useEffect(() => {
    setTimeout(() => {
      loadingFetcehr.submit(
        { loading: JSON.stringify({ data: true }) },
        { method: "POST" },
      );
    }, 3000);
  }, []);

  useEffect(() => {
    if (loadingFetcehr.data) {
      shopify.toast.show("Loading completed");
      setProductsData(loadingFetcehr.data);
      console.log(loadingFetcehr.data);
      setIsLoading(false);
    }
  }, [loadingFetcehr.data]);

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <ImportProductBanner />
          </Layout.Section>
          <Layout.Section>
            <ProductListCard loading={isLoading} productsData={productsData} />
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
