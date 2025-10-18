import { Clipboard, ClipboardCheck, X } from 'lucide-react';
import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import Header from './components/Header';
import { useLanguage } from './components/LanguageContext';
import { Button } from './components/ui/button';
import { MESSAGES } from './constants';

function App() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  interface Headers {
    [key: string]: string;
  }
  const initialHeader: Headers = { "": "" };
  const [headers, setHeaders] = useState([initialHeader]);
  const [body, setBody] = useState("");
  interface Options {
    [key: string]: boolean;
  }
  const initialOptions: Options = {
    includeHeaders: false, // -i
    followRedirects: false, // -L
    verbose: false, // -v
    insecure: false, // -k
    useBasicAuth: false, // -u
    useBearer: false, // -H Authorization
    useOutput: false, // -o
  };
  const [options, setOptions] = useState(initialOptions);
  const [auth, setAuth] = useState({ user: "", pass: "", token: "" });
  const [outputFile, setOutputFile] = useState("");

  const [copied, setCopied] = useState(false);

  const { lang } = useLanguage();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateCurl());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // オプション切り替え
  const toggle = (key: string) => {
    setOptions({ ...options, [key]: !options[key] });
  };

  // ヘッダー更新
  const updateHeader = (index: number, field: string, value: string) => {
    const newHeaders = [...headers];
    const nextHeader = { ...newHeaders[index], [field]: value };

    // 両方空でなければ state 更新
    if (nextHeader.key?.trim() !== "" && nextHeader.value?.trim() !== "") {
      newHeaders[index] = nextHeader;
      setHeaders(newHeaders);
    } else {
      // 片方だけ入力中でも UI 表示用に反映（undefined対策）
      newHeaders[index] = nextHeader;
      setHeaders(newHeaders);
    }
  };

  const deleteHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, initialHeader]);
  };

  // curlコマンド生成
  const generateCurl = () => {
    if (!url) return "";

    let cmd = `curl -X ${method} "${url}"`;

    if (options.includeHeaders) cmd += " -i";
    if (options.followRedirects) cmd += " -L";
    if (options.verbose) cmd += " -v";
    if (options.insecure) cmd += " -k";

    // 認証
    if (options.useBasicAuth && (auth.user || auth.pass)) {
      cmd += ` -u "${auth.user}:${auth.pass}"`;
    }
    if (options.useBearer && auth.token) {
      cmd += ` \\\n  -H "Authorization: Bearer ${auth.token}"`;
    }

    // Headers
    headers.forEach(({ key, value }) => {
      if (key && value) cmd += ` \\\n  -H "${key}: ${value}"`;
    });

    // Body
    if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
      cmd += ` \\\n  -d '${body}'`;
    }

    // 出力
    if (options.useOutput && outputFile) {
      cmd += ` \\\n  -o ${outputFile}`;
    }

    return cmd;
  };

  return (
    <>
      <Header />
      <div className="w-full max-w-2xl min-h-screen px-4 py-4 mx-auto space-y-6">
        {/* メソッド・URL */}
        <div>
          <div className="flex space-x-2">
            <div className="flex flex-col">
              <h2 className="mb-2 font-semibold text-primary">
                {MESSAGES[lang].method}
              </h2>
              <Select
                value={method}
                onValueChange={(value: string) => setMethod(value)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col w-full">
              <h2 className="mb-2 font-semibold text-primary">URL</h2>
              <Input
                placeholder="https://example.com/api"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Headers */}
        <div>
          <h2 className="mb-2 font-semibold text-primary">
            {MESSAGES[lang].headers}
          </h2>
          {headers.map((h, i) => (
            <div key={i} className="flex items-center mb-2 space-x-2">
              <Input
                placeholder="Key"
                value={h.key ?? ""}
                onChange={(e) => updateHeader(i, "key", e.target.value)}
                className="w-1/2"
              />
              <Input
                placeholder="Value"
                value={h.value ?? ""}
                onChange={(e) => updateHeader(i, "value", e.target.value)}
              />
              <Button
                onClick={() => deleteHeader(i)}
                variant="outline"
                className="w-7 h-7"
              >
                <X />
              </Button>
            </div>
          ))}
          <Button
            onClick={addHeader}
            variant="outline"
            className="text-primary"
          >
            {MESSAGES[lang].addHeader}
          </Button>
        </div>

        {/* Body */}
        {["POST", "PUT", "PATCH"].includes(method) && (
          <div>
            <h2 className="mb-2 font-semibold text-primary">
              {MESSAGES[lang].body}
            </h2>
            <Textarea
              placeholder='{"key": "value"}'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-24 p-2 font-mono"
            />
          </div>
        )}

        {/* オプション */}
        <div>
          <h2 className="mb-2 font-semibold text-primary">
            {MESSAGES[lang].options}
          </h2>
          <div className="flex flex-col space-y-2">
            <label>
              <Checkbox
                checked={options.includeHeaders}
                onCheckedChange={() => toggle("includeHeaders")}
              />
              <span className="ml-2">
                {MESSAGES[lang].optionIncludeHeaders}
              </span>
            </label>
            <label>
              <Checkbox
                checked={options.followRedirects}
                onCheckedChange={() => toggle("followRedirects")}
              />
              <span className="ml-2">
                {MESSAGES[lang].optionFollowRedirects}
              </span>
            </label>
            <label>
              <Checkbox
                checked={options.verbose}
                onCheckedChange={() => toggle("verbose")}
              />
              <span className="ml-2">{MESSAGES[lang].optionVerbose}</span>
            </label>
            <label>
              <Checkbox
                checked={options.insecure}
                onCheckedChange={() => toggle("insecure")}
              />
              <span className="ml-2">{MESSAGES[lang].optionInsecure}</span>
            </label>
          </div>
        </div>

        {/* 認証 */}
        <div>
          <h2 className="mb-2 font-semibold text-primary">
            {MESSAGES[lang].auth}
          </h2>
          <div className="flex flex-col space-y-2">
            <label>
              <Checkbox
                checked={options.useBasicAuth}
                onCheckedChange={() => toggle("useBasicAuth")}
              />
              <span className="ml-2">{MESSAGES[lang].optionBasicAuth}</span>
            </label>
            {options.useBasicAuth && (
              <div>
                <Input
                  placeholder={MESSAGES[lang].placeholderUserName}
                  value={auth.user}
                  onChange={(e) => setAuth({ ...auth, user: e.target.value })}
                  className="mb-2"
                />
                <Input
                  placeholder={MESSAGES[lang].placeholderPassword}
                  value={auth.pass}
                  onChange={(e) => setAuth({ ...auth, pass: e.target.value })}
                />
              </div>
            )}

            <label>
              <Checkbox
                checked={options.useBearer}
                onCheckedChange={() => toggle("useBearer")}
              />
              <span className="ml-2">{MESSAGES[lang].optionBearerToken}</span>
            </label>
            {options.useBearer && (
              <Input
                placeholder={MESSAGES[lang].placeholderBearerToken}
                value={auth.token}
                onChange={(e) => setAuth({ ...auth, token: e.target.value })}
              />
            )}
          </div>
        </div>

        {/* 出力 */}
        <div className="flex flex-col space-y-2">
          <h2 className="mb-2 font-semibold text-primary">
            {MESSAGES[lang].output}
          </h2>
          <label>
            <Checkbox
              checked={options.useOutput}
              onCheckedChange={() => toggle("useOutput")}
            />
            <span className="ml-2">{MESSAGES[lang].optionOutput}</span>
          </label>
          {options.useOutput && (
            <Input
              placeholder={MESSAGES[lang].placeholderFileName}
              value={outputFile}
              onChange={(e) => setOutputFile(e.target.value)}
            />
          )}
        </div>

        {/* 生成結果 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-primary">
              {MESSAGES[lang].result}
            </h2>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="w-28"
              size="sm"
            >
              {copied && (
                <>
                  <ClipboardCheck />
                  Copied!
                </>
              )}
              {!copied && (
                <>
                  <Clipboard />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="bg-gray-100 whitespace-pre-wrap break-all p-3 border-input dark:bg-input/80 min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm">
            {generateCurl()}
          </pre>
        </div>
      </div>
    </>
  );
}

export default App;
