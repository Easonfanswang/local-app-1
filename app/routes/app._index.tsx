import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Page, Layout, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import ImportProductBanner from "./components/ImportProductBanner";
import ProductListCard from "./components/ProductListCard";
import { productMutations } from "app/api/admin";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const adminAuthResult = await authenticate.admin(request);
  const { shop } = adminAuthResult.session;
  return { shop };
};

// 随机单词数组
const words = [
  "Elegant",
  "Casual",
  "Fashion",
  "Vintage",
  "Modern",
  "Classic",
  "Trendy",
  "Stylish",
  "Luxury",
  "Simple",
  "Chic",
  "Designer",
  "Women",
  "Men",
  "Dress",
  "Shirt",
  "Pants",
  "Jacket",
  "Coat",
  "Sweater",
  "Skirt",
  "Jeans",
  "Cotton",
  "Silk",
  "Wool",
  "Leather",
  "Summer",
  "Winter",
  "Spring",
  "Autumn",
];

// 生成随机标题
const generateRandomTitle = () => {
  const titleLength = Math.floor(Math.random() * 4) + 3; // 3-6个单词
  return Array(titleLength)
    .fill(null)
    .map(() => words[Math.floor(Math.random() * words.length)])
    .join(" ");
};

// 生成随机描述
const generateRandomDescription = () => {
  const descLength = Math.floor(Math.random() * 10) + 5; // 5-14个单词
  return `<p>${Array(descLength)
    .fill(null)
    .map(() => words[Math.floor(Math.random() * words.length)])
    .join(" ")}</p>`;
};

// 生成随机数据数组
const generateRandomData = () => {
  return Array(12)
    .fill(null)
    .map((_, index) => ({
      id: (index + 1).toString(),
      title: generateRandomTitle(),
      number: Math.floor(Math.random() * 100) + 1,
      descriptionHtml: generateRandomDescription(),
      productOptions: {
        Color: ["Red", "Green", "Blue"],
        Size: ["Small", "Medium", "Large"],
      },
      variants: [
        {
          id: "0",
          optionValues: [
            { optionName: "Color", name: "Red" },
            { optionName: "Size", name: "Small" },
          ],
          image:
            "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
          price: {
            currencyCode: "USD",
            amount: 100,
          },
        },
        {
          id: "1",
          optionValues: [
            { optionName: "Color", name: "Red" },
            { optionName: "Size", name: "Medium" },
          ],
          image:
            "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
          price: {
            currencyCode: "USD",
            amount: 140,
          },
        },
        {
          id: "2",
          optionValues: [
            { optionName: "Color", name: "Red" },
            { optionName: "Size", name: "Large" },
          ],
          image:
            "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
          price: {
            currencyCode: "USD",
            amount: 120,
          },
        },
        {
          id: "3",
          optionValues: [
            { optionName: "Color", name: "Green" },
            { optionName: "Size", name: "Small" },
          ],
          image:
            "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
          price: {
            currencyCode: "USD",
            amount: 130,
          },
        },
        {
          id: "4",
          optionValues: [
            { optionName: "Color", name: "Green" },
            { optionName: "Size", name: "Medium" },
          ],
          image:
            "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
          price: {
            currencyCode: "USD",
            amount: 120,
          },
        },
        {
          id: "5",
          optionValues: [
            { optionName: "Color", name: "Green" },
            { optionName: "Size", name: "Large" },
          ],
          image:
            "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
          price: {
            currencyCode: "USD",
            amount: 130,
          },
        },
        {
          id: "6",
          optionValues: [
            { optionName: "Color", name: "Blue" },
            { optionName: "Size", name: "Small" },
          ],
          image:
            "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
          price: {
            currencyCode: "USD",
            amount: 180,
          },
        },
        {
          id: "7",
          optionValues: [
            { optionName: "Color", name: "Blue" },
            { optionName: "Size", name: "Medium" },
          ],
          image:
            "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
          price: {
            currencyCode: "USD",
            amount: 140,
          },
        },
        {
          id: "8",
          optionValues: [
            { optionName: "Color", name: "Blue" },
            { optionName: "Size", name: "Large" },
          ],
          image:
            "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
          price: {
            currencyCode: "USD",
            amount: 160,
          },
        },
      ],
      images: [
        "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71rPUJ72P5L._AC_SL1500_.jpg",
      ],
      shopifyUrl: "",
      amazonUrl: "",
    }));
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  if ("loading" in formObject) {
    const data = {
      data: generateRandomData(),
      pageInfo: {
        page: 1,
        totalPage: 30,
      },
    };
    // 处理第二个 fetcher 的请求
    console.log("data:", data);
    return data;
  }

  if ("productData" in formObject) {
    try {
      const productData = JSON.parse(formObject.productData as string);

      // 调用 productMutations 创建产品
      const data = await productMutations({
        request,
        data: productData,
      });

      return data;
    } catch (error) {
      console.log("app productData ERROR: ", error);
    }
  }

  return null;
};

export default function Index() {
  const { shop } = useLoaderData<typeof loader>();
  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <ImportProductBanner />
          </Layout.Section>
          <Layout.Section>
            <ProductListCard shop={shop} />
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
