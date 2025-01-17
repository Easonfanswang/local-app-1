import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import ImportProductBanner from "./components/ImportProductBanner";
import ProductListCard from "./components/ProductListCard";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  if ("loading" in formObject) {
    const data = JSON.parse(formObject.loading as string);
    // 处理第二个 fetcher 的请求
    console.log("data:", data);
    return data;
  }

  return null;
};

export default function Index() {
  const loadingFetcehr = useFetcher<any>();

  const shopify = useAppBridge();

  const isLoading =
    ["loading", "submitting"].includes(loadingFetcehr.state) &&
    loadingFetcehr.formMethod === "POST";

  useEffect(() => {
    loadingFetcehr.submit(
      { loading: JSON.stringify({ data: true }) },
      { method: "POST" },
    );
  }, []);

  useEffect(() => {
    if (loadingFetcehr.data) {
      console.log(loadingFetcehr.data);
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
            <ProductListCard />
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
