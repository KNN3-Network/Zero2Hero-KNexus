import Head from "next/head";
import React, { ReactNode, useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import CornerHighlight from "../../components/cornerHighlight/CornerHighlight";
import Exclude1 from "../../../public/images/exclude1.svg";
import Exclude2 from "../../../public/images/exclude2.svg";
import Exclude3 from "../../../public/images/exclude3.svg";
import Editor from "@monaco-editor/react";

import {
  Button,
  Table,
  Flex,
  TableContainer,
  Tbody,
  Td,
  Box,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Loading from "@/components/Loading";
import { useStore } from "@/lib/store";
import { BaseModal } from "@/components/BaseModal";

const setEditorTheme = (monaco: any) => {
  monaco.editor.defineTheme("spx-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#1a1a1a",
    },
  });
};

const example = `
CREATE TABLE dbo.EmployeePhoto
(
    EmployeeId INT NOT NULL PRIMARY KEY,
    Photo VARBINARY(MAX) FILESTREAM NULL,
    MyRowGuidColumn UNIQUEIDENTIFIER NOT NULL ROWGUIDCOL
                    UNIQUE DEFAULT NEWID()
);

GO

/*
text_of_comment
/* nested comment */
*/

-- line comment

CREATE NONCLUSTERED INDEX IX_WorkOrder_ProductID
    ON Production.WorkOrder(ProductID)
    WITH (FILLFACTOR = 80,
        PAD_INDEX = ON,
        DROP_EXISTING = ON);
GO

WHILE (SELECT AVG(ListPrice) FROM Production.Product) < $300
BEGIN
    UPDATE Production.Product
      SET ListPrice = ListPrice * 2
    SELECT MAX(ListPrice) FROM Production.Product
    IF (SELECT MAX(ListPrice) FROM Production.Product) > $500
      BREAK
    ELSE
      CONTINUE
END
PRINT 'Too much for the market to bear';

MERGE INTO Sales.SalesReason AS [Target]
USING (VALUES ('Recommendation','Other'), ('Review', 'Marketing'), ('Internet', 'Promotion'))
        AS [Source] ([NewName], NewReasonType)
ON [Target].[Name] = [Source].[NewName]
WHEN MATCHED
THEN UPDATE SET ReasonType = [Source].NewReasonType
WHEN NOT MATCHED BY TARGET
THEN INSERT ([Name], ReasonType) VALUES ([NewName], NewReasonType)
OUTPUT $action INTO @SummaryOfChanges;

SELECT ProductID, OrderQty, SUM(LineTotal) AS Total
FROM Sales.SalesOrderDetail
WHERE UnitPrice < $5.00
GROUP BY ProductID, OrderQty
ORDER BY ProductID, OrderQty
OPTION (HASH GROUP, FAST 10);
              `;

const excludes = [Exclude1, Exclude2, Exclude3];

const stages = [
  "Please provide a detailed description of the data you require in the chatbox.",
  "If the data provided is not exactly what you need, feel free to modify your description accordinglyto regenerate.",
  "Click on &quot;Continue&quot; to convert this assignmentinto an SDK.",
];
export function Stage(props: { index: number; title: string | ReactNode }) {
  const { index, title } = props;
  return (
    <li className="font-jura flex py-10 whitespace-normal items-center">
      <div className="relative w-[40px] h-[40px] border-slate-500 border text-[#BBE7E6] flex justify-center items-center flex-grow-0 flex-shrink-0 self-start">
        <Image src={excludes[index]} alt="" />
      </div>
      <div className="ml-5 pr-20" style={{ wordBreak: "break-all" }}>
        {title}
      </div>
    </li>
  );
}

const dataList = [
  {
    Date: "0x41fc366b36a56e6d65f9ac165a66da36f8b23011",
    posts: 22162,
    mirrors: "starl.lens",
    comments: "B",
  },
  {
    Date: "0x8fae45b4af23eb4bbedbd8c2e4b861326fbd460b",
    posts: 56243,
    mirrors: "vanilluxe.lens",
    comments: "D",
  },
  {
    Date: "0x860442b5c31527d5c0a7670b88d4ea333c95788a",
    posts: 56763,
    mirrors: "satisfy.lens",
    comments: "D",
  },
  {
    Date: "0x0c1b3dbc2e038a19b0dae0a9070828891e61f909",
    posts: 56792,
    mirrors: "thegreatestworkintheworld.lens",
    comments: "D",
  },
  {
    Date: "0x8dfa288c28eaad5b2d23168c05d0f42a6972c7c5",
    posts: 56815,
    mirrors: "pei2817.lens",
    comments: "D",
  },
  {
    Date: "0x54fe8f873a7e3069f80363c5f54d119589ccd969",
    posts: 56860,
    mirrors: "halve.lens",
    comments: "D+",
  },
  {
    Date: "0x2a2641ca5a6ecd3de54bdca342689efda9f0a4c0",
    posts: 56874,
    mirrors: "manner.lens",
    comments: "D",
  },
  {
    Date: "0xd87f85d6cf612c259d8f8db9d072a070ffcab706",
    posts: 56919,
    mirrors: "prowl.lens",
    comments: "D",
  },
  {
    Date: "0x18a698b167e61388eb9953f42b88c5d92f26dd82",
    posts: 56989,
    mirrors: "dweller.lens",
    comments: "D",
  },
  {
    Date: "0x2b40d5ea53923a94dd6256596da8b37885674052",
    posts: 57480,
    mirrors: "kokomi.lens",
    comments: "D+",
  },
];

export default function ConstructAssignment() {
  const { setComModalOpen, comModalOpen, groupModalOpen, setGroupModalOpen } =
    useStore();
  const [bucketName, setBucketName] = useState("");
  const [tableVisible, setTableVisible] = useState(false);
  const [demand, setDemand] = useState("");
  const [runSqlLoding, setRunSqlLoding] = useState(false);
  const [fetchTableDataLoading, setFetchTableDataLoading] = useState(false);
  const editorRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(600);
  const router = useRouter();
  const handleEditorDidContentSizeChange = (editor: any) => {
    const contentHeight = editor.getContentHeight();
    if (contentHeight !== editorHeight) {
      setEditorHeight(contentHeight);
    }
  };
  const handleRunSql = useCallback(() => {
    setTableVisible(true);
    setFetchTableDataLoading(true);
    setTimeout(() => {
      setFetchTableDataLoading(false);
    }, 2000);
  }, []);

  const handleRun = useCallback(() => {
    // setDemand(e.target.value);
    setComModalOpen(true);
  }, []);

  return (
    <>
      <Head>
        <title>Construct Assignment</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex flex-row justify-between mx-20 mt-20">
        <div className="flex-1 flex flex-row justify-between shrink-0">
          <CornerHighlight cornerHighlightPosition="cornerHighlightTL">
            {/* <Image src={LeftBracket} alt="" priority style={{height: '100%', marginLeft: -5}} /> */}
          </CornerHighlight>
          <div className="rounded-md flex flex-1 flex-col justify-between bg-[#1e1e1e]">
            <h2 className="text-xl pl-8 pt-2">Input your SQL here</h2>
            <Editor
              width="100%"
              options={{
                readOnly: false,
                minimap: { enabled: false },
                automaticLayout: true,
                fontSize: 12,
              }}
              className="py-4 px-2"
              height={editorHeight}
              beforeMount={setEditorTheme}
              theme="vs-dark"
              defaultLanguage="sql"
              language="sql"
              defaultValue={example}
            />
            <button
              className="bg-[#373737] px-8 py-1 rounded self-end mb-4 mr-8"
              onClick={() => handleRunSql()}
            >
              Run
            </button>
          </div>
          <CornerHighlight cornerHighlightPosition="cornerHighlightBR">
            {/* <Image src={RightBracket} alt="" style={{height: '100%', marginRight: -10}} /> */}
          </CornerHighlight>
        </div>
        <div className="w-20"></div>
        <div className="flex flex-1 flex-row justify-between self-start sticky top-[180px]">
          <div className="flex flex-1 flex-col justify-center items-center w-full h-[660px] overflow-hidden">
            {!tableVisible ? (
              <div className="bg-[#1e1e1e] w-full min-h-[620px] flex items-center justify-center">
                Please run the SQL
              </div>
            ) : fetchTableDataLoading ? (
              <div className="bg-[#1e1e1e] w-full min-h-[620px] flex items-center justify-center">
                <Loading />{" "}
              </div>
            ) : (
              <>
                <TableContainer
                  background={"#1e1e1e"}
                  className="w-full min-h-[600px]"
                  overflowY="auto"
                >
                  <Table size="lg" className="w-full">
                    <Thead
                      position="sticky"
                      top={0}
                      zIndex={10}
                      background={"#1e1e1e "}
                    >
                      <Tr>
                        <Th>Follower</Th>
                        <Th textAlign="center">follower_profileid</Th>
                        <Th textAlign="center">follower_handle</Th>
                        <Th isNumeric>influence_level</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dataList.map((item, index) => (
                        <Tr border="hidden" key={index}>
                          <Td>{item.Date.slice(0,3)}...{item.Date.slice(-3)}</Td>
                          <Td textAlign="center">{item.posts}</Td>
                          <Td textAlign="center">{item.mirrors}</Td>
                          <Td isNumeric>{item.comments}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                <button
                  className="bg-[#373737] px-8 py-1 rounded self-end mt-4"
                  onClick={() => handleRun()}
                >
                  Run
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* create bucket */}
      <BaseModal isOpen={comModalOpen} onClose={() => setComModalOpen(false)}>
        <Flex w="full" justifyContent="space-between" flexDirection="column">
          <div className="mt-[20px] lg:w-[400px] sm:w-[300px]">
            <h3>Bucket Name</h3>
            <input
              type="text"
              placeholder="Please enter"
              className="my-6 text-[#000] w-full h-[35px] bg-[#A0A79F] font-swiss721md border-0 block"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
            />
            <p className="font-jura text-sm ml-2">
              No Bucket has been created for your account.
            </p>
          </div>
          <Box mt={5} textAlign="right">
              <Button
                variant="grayPrimary"
                fontSize="sm"
                paddingX={6}
                color={bucketName.length ? "#fff" : "#999"}
                className="!mt-[10px] h-[35px] leading-3"
                onClick={() => {
                  setComModalOpen(false);
                  router.push("/bucket");
                }}
              >
                Submit
              </Button>
          </Box>
        </Flex>
      </BaseModal>
    </>
  );
}
