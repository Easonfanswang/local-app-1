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
  // 生成随机句子
  const generateRandomSentence = (
    minWords: number = 5,
    maxWords: number = 15,
  ) => {
    const length = Math.floor(Math.random() * (maxWords - minWords)) + minWords;
    return (
      Array(length)
        .fill(null)
        .map(() => words[Math.floor(Math.random() * words.length)])
        .join(" ") + "."
    );
  };

  // 生成随机特性数组
  const generateRandomFeatures = () => {
    const length = Math.floor(Math.random() * 5) + 3; // 3-7个特性
    return Array(length)
      .fill(null)
      .map(() => ` ${generateRandomSentence(3, 8)} `);
  };

  // 生成随机对象
  const generateRandomObject = (
    minProps: number = 3,
    maxProps: number = 10,
  ) => {
    const length = Math.floor(Math.random() * (maxProps - minProps)) + minProps;
    const obj: Record<string, string> = {};

    Array(length)
      .fill(null)
      .forEach(() => {
        // 生成随机key（1-3个单词）
        const key = Array(Math.floor(Math.random() * 3) + 1)
          .fill(null)
          .map(() => words[Math.floor(Math.random() * words.length)])
          .join(" ");

        // 生成随机value（1-5个单词）
        const value = Array(Math.floor(Math.random() * 5) + 1)
          .fill(null)
          .map(() => words[Math.floor(Math.random() * words.length)])
          .join(" ");

        obj[key] = value;
      });

    return obj;
  };

  return {
    PDS: ` <span>${generateRandomSentence(10, 30)}</span> `,

    PF: generateRandomFeatures(),

    PI: generateRandomObject(10, 20),

    PO: generateRandomObject(3, 6),
  };
};

export const convertDescriptionToHtml = (description: any) => {
  // 如果整个 description 对象不存在，返回空字符串
  if (!description) return "";

  // 构建 Product Overview (PO) HTML
  const poHtml = description.PO
    ? `
    <div>
      <p><strong>Product Overview</strong></p>
      <ul>
        ${Object.entries(description.PO)
          .map(
            ([key, value]) =>
              `<li><strong>${key}:</strong> ${value || ""}</li>`,
          )
          .join("")}
      </ul>
      <br>
    </div>
  `
    : "";

  // 构建 Product Description (PDS) HTML
  const pdsHtml = description.PDS
    ? `
    <p><strong>Product Description</strong></p>
    <div id="productDescription" class="a-section a-spacing-small">
      <p>${description.PDS}</p>
    </div>
    <br><br>
  `
    : "";

  // 构建 Product Features (PF) HTML
  const pfHtml = description.PF?.length
    ? `
    <p><strong>Product Features</strong></p>
    <ul>
      ${description.PF.map((feature: any) => `<li>${feature || ""}</li>`).join("")}
    </ul>
    <br>
  `
    : "";

  // 构建 Product Information (PI) HTML
  const piHtml = description.PI
    ? `
    <p><strong>Product Information</strong></p>
    <div style="margin-bottom:20px">
    <table style="margin-bottom:20px">
      <tbody>
        ${Object.entries(description.PI)
          .map(
            ([key, value]) => `
          <tr>
            <td><strong>${key}</strong></td>
            <td><span style="margin-left:20px">${value || ""}</span></td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
    <br>
  `
    : "";

  // 如果所有部分都为空，返回空字符串
  if (!poHtml && !pdsHtml && !pfHtml && !piHtml) {
    return "";
  }

  // 组合所有HTML
  return `<div>${poHtml}${pdsHtml}${pfHtml}${piHtml}</div>`;
};

// 生成随机数据数组
const generateRandomData = () => {
  return Array(12)
    .fill(null)
    .map((_, index) => ({
      id: (index + 1).toString(),
      title: generateRandomTitle(),
      number: Math.floor(Math.random() * 100) + 1,
      description: generateRandomDescription(),
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
