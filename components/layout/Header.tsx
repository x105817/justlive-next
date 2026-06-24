import Link from 'next/link';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          JustLive
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-primary transition-colors">
            首页
          </Link>
          {session?.user && (
            <Link href="/follows" className="hover:text-primary transition-colors">
              我的关注
            </Link>
          )}
          <Link href="/search" className="hover:text-primary transition-colors">
            搜索
          </Link>

          <div className="ml-4">
            {session?.user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {session.user.email}
                </span>
                <form action="/api/auth/signout" method="post">
                  <Button type="submit" variant="outline" size="sm">
                    退出
                  </Button>
                </form>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">登录</Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
